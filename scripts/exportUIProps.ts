import fs from 'fs/promises'
import path from 'path'
import glob from 'glob'
import * as docgen from 'react-docgen-typescript'

const SRC_PATH = path.join(__dirname, '../node_modules/smarthr-ui/lib/**/**.d.ts')
const IGNORE_FILE_WORDS = ['test', 'libs', 'use', 'index.d.ts', 'hocs', 'setupTests']
const excludeFilesRegExp = new RegExp(`^(?!.*(${IGNORE_FILE_WORDS.join('|')})).*$`)
// Props を独自に実装したものに絞る
const propsNameRegExp = /.*(?=Props|TypeLiteral$)/
const IGNORE_DECLARATIONS = ['ElementProps', 'StyleProps']
const excludeDeclarationsRegExp = new RegExp(`^(?!.*(${IGNORE_DECLARATIONS.join('|')})).*$`)

glob(SRC_PATH, async (err, files) => {
  if (err) {
    console.error(err)
    process.exitCode = 1
  }

  const targets = files.filter((file) => excludeFilesRegExp.test(file))
  const fileParser = docgen.withCompilerOptions(
    { esModuleInterop: true },
    {
      shouldExtractValuesFromUnion: true,
      propFilter: {
        skipPropsWithName: ['as', 'id', 'inputMode', 'is'],
      },
    },
  )
  const docs = fileParser.parse(targets).map(({ props, ...other }) => {
    const fileteredProps = Object.keys(props).flatMap((name) => {
      const propItem = props[name]
      const declarations = propItem.declarations

      if (!declarations) {
        return propItem
      }

      const declarationName = declarations[0].name
      return propsNameRegExp.test(declarationName) && excludeDeclarationsRegExp.test(declarationName) ? propItem : []
    })

    return {
      ...other,
      props: fileteredProps,
    }
  })

  await fs.writeFile('smarthr-ui-props.json', JSON.stringify(docs))
})
