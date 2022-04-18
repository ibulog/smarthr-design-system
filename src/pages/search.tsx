import React, { VFC } from 'react'
import styled from 'styled-components'
import { Head } from '../components/Head'
import algoliasearch from 'algoliasearch/lite'
import { InstantSearch } from 'react-instantsearch-dom'

import { CustomSearchBox } from '../components/search/Search'
import { GlobalStyle } from '../components/shared/GlobalStyle/GlobalStyle'
import { Header } from '../components/shared/Header/Header'
import { CSS_COLOR, CSS_SIZE } from '../constants/style'
import { Footer } from '../components/shared/Footer/Footer'
import { IndexList } from '../components/search/IndexList/IndexList'

const searchClient = algoliasearch(process.env.GATSBY_ALGOLIA_APP_ID || '', process.env.GATSBY_ALGOLIA_SEARCH_API_KEY || '')

const SearchPage: VFC = () => {
  return (
    <>
      <Head title="検索" description="検索ページです。" />
      <GlobalStyle />

      <Wrapper>
        <Header />

        <Main>
          <PageTitle id="label-for-search-input">SmartHR Design Systemを検索</PageTitle>
          <Search className="ais-SearchBox__root">
            <InstantSearch indexName="content" searchClient={searchClient}>
              <CustomSearchBox />
            </InstantSearch>
          </Search>
        </Main>
        <IndexList />
        <Footer />
      </Wrapper>
    </>
  )
}

export default SearchPage

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  & > header {
    flex: 0 0 auto;
  }
`

const Main = styled.main`
  padding-inline: 16px;

  @media (max-width: ${CSS_SIZE.BREAKPOINT_MOBILE_3}) {
    margin-top: 0;
  }
`

const PageTitle = styled.h1`
  margin-block: 140px 40px;
  text-align: center;
  line-height: 1.25;
`

const Search = styled.div`
  color: ${CSS_COLOR.TEXT_BLACK};
  display: flex;
  flex-direction: column;
  align-items: center;
`
