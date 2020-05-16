import ExternLink from 'components/ExternLink';
import Millify from 'millify';
import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react';
import cx from 'utils/cx';
import filter from 'utils/filter';
import toArray from 'utils/iterableToArray';
import pipe from 'utils/pipe';
import strIncludes from 'utils/strIncludes';
import strLowerCase from 'utils/strLowerCase';
import ternary from 'utils/ternary';

import List from '@researchgate/react-intersection-list';

import type { Dehydrator, HydrationPair, Hydrator } from 'types';
type SearchRecord = HydrationPair<
  {
    /**
     * types package name
     */
    t: string;
    /**
     * globals
     */
    g: string[];
    /**
     * modules
     */
    m: string[];
    /**
     * project website
     */
    p: string;
    /**
     * library name
     */
    l: string;
    /**
     * downloads in the last month from NPM
     */
    d: number;
  },
  [string, string[], string[], string, string, number]
>;

type PageData = HydrationPair<
  { searchRecord: SearchRecord['HYDRATED'][] },
  [SearchRecord['DEHYDRATED'][]]
>;

const dehydrateSearchRecord: Dehydrator<SearchRecord> = ({
  t,
  g,
  m,
  p,
  l,
  d,
}) => [t, g, m, p, l, d];

const hydrateSearchRecord: Hydrator<SearchRecord> = ([t, g, m, p, l, d]) => ({
  t,
  g,
  m,
  p,
  l,
  d,
});

const dehydratePageData: Dehydrator<PageData> = ({ searchRecord }) => [
  searchRecord.map(dehydrateSearchRecord),
];

const hydratePageData: Hydrator<PageData> = ([searchRecord]) => ({
  searchRecord: searchRecord.map(hydrateSearchRecord),
});

interface Props {
  data: PageData['DEHYDRATED'];
}

const linkClassName = 'text-blue-500 hover:underline';

const queryParamKey = 'q';

const DataContext = createContext<SearchRecord['HYDRATED'][]>([]);

export interface TypesearchQueryResults {
  query: string;
}

const TypesearchQueryResults: FC<TypesearchQueryResults> = ({ query }) =>
  pipe(
    filter<SearchRecord['HYDRATED']>(
      pipe(({ t }) => t, strLowerCase, pipe(strLowerCase, strIncludes)(query))
    ),
    toArray,
    ternary(
      (record) => record.length > 0,
      (record) => {
        const { length } = record;
        return (
          <List
            itemCount={length}
            pageSize={length <= 20 ? length : 20}
            itemsRenderer={(items, ref) => (
              <div
                className="flex-grow flex flex-wrap items-start content-start"
                ref={ref as any}
              >
                {items}
              </div>
            )}
            renderItem={(index, key) => {
              const {
                [index]: { d, l, t },
              } = record;
              return (
                <ExternLink
                  key={key}
                  href={`https://www.npmjs.org/package/@types/${t}`}
                  className="bg-gray-300 m-2 px-2 py-1 rounded-lg font-medium flex items-center"
                >
                  <div>
                    <h3 className="font-semibold">{t}</h3>
                    <div className="text-sm text-gray-600">{l}</div>
                  </div>
                  {d > 0 && (
                    <div className={cx('ml-3 text-xs')}>
                      {Millify(d, { precision: 1 })}
                    </div>
                  )}
                </ExternLink>
              );
            }}
          />
        );
      },
      () => (
        <div className="flex-grow flex items-center content-center justify-center flex-col">
          <div className="text-3xl">¯\_(ツ)_/¯</div>
          <div>No matches found</div>
        </div>
      )
    )
  )(useContext(DataContext));

const TypesearchApp: FC = () => {
  const router = useRouter();

  const query = useMemo(() => {
    if (queryParamKey in router.query) {
      const q = router.query[queryParamKey];
      if (q instanceof Array) return q[0];
      return q;
    } else return undefined;
  }, [router.query]);

  const changeQueryParam = useCallback(
    (val?: string) => {
      const url = `${router.pathname}${
        val === undefined || val.length === 0 ? '' : `?${queryParamKey}=${val}`
      }`;
      router.push(url, url, { shallow: true });
    },
    [router]
  );

  const handleChange = useCallback<
    (event: React.ChangeEvent<HTMLInputElement>) => void
  >(
    (evt) => {
      changeQueryParam(evt.target.value);
    },
    [changeQueryParam]
  );

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      {query === undefined && (
        <div className="px-4 py-5">
          <ExternLink
            href="https://wongmjane.com"
            className="text-gray-600 hover:text-blue-600"
          >
            @wongmjane
          </ExternLink>{' '}
          <ExternLink
            href="https://github.com/wongmjane/typescout"
            className="text-gray-600 hover:text-blue-600"
          >
            Source
          </ExternLink>
        </div>
      )}
      <div
        className={cx(
          'flex px-4 py-3 items-center',
          query
            ? 'sticky top-0 shadow bg-gray-200 mb-2'
            : 'flex-grow flex-col justify-center'
        )}
      >
        <h1
          className={cx(
            'text-lg font-medium md:font-normal mr-4',
            query ? 'cursor-pointer' : 'text-4xl mb-4'
          )}
          role={query ? 'button' : 'figure'}
          onClick={
            query
              ? () => {
                  if (inputRef.current) {
                    inputRef.current.value = '';
                  }

                  changeQueryParam();
                }
              : () => void 0
          }
        >
          TypeScout
        </h1>
        <input
          ref={inputRef}
          type="search"
          onChange={handleChange}
          defaultValue={query}
          placeholder="Search for @types/* Packages"
          className={cx(
            'shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 focus:outline-none focus:shadow-outline',
            query === undefined && 'max-w-lg'
          )}
        />
      </div>
      {query && <TypesearchQueryResults query={query} />}
      <footer className="text-center text-sm px-4 pt-2 pb-4 text-gray-500">
        <div>
          Powered by{' '}
          <ExternLink href="https://github.com/DefinitelyTyped/DefinitelyTyped">
            DefinitelyTyped
          </ExternLink>{' '}
          and{' '}
          <ExternLink href="https://github.com/Microsoft/types-publisher">
            types-publisher
          </ExternLink>
          , via{' '}
          <ExternLink href="https://microsoft.github.io/TypeSearch/">
            TypeSearch
          </ExternLink>
        </div>
        {query !== undefined && (
          <div>
            By{' '}
            <Link href="/">
              <a className={linkClassName}>@wongmjane</a>
            </Link>
          </div>
        )}
      </footer>
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => ({
  unstable_revalidate: 600,
  props: {
    data: dehydratePageData({
      searchRecord: (await (
        await fetch(
          'https://typespublisher.blob.core.windows.net/typespublisher/data/search-index-min.json'
        )
      ).json()) as SearchRecord['HYDRATED'][],
    }),
  },
});

const seoDesc = 'TypeScript Types Searcher';

const TypesearchPage: NextPage<Props> = ({ data }) => {
  const { searchRecord } = useMemo(() => hydratePageData(data), [data]);
  return (
    <>
      <Head>
        <title>TypeScout</title>
        <meta name="description" content={seoDesc} />
        <meta property="og:title" content="TypeScout" />
        <meta property="og:description" content={seoDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:title" content="TypeScout" />
        <meta name="twitter:description" content={seoDesc} />
      </Head>
      <main className="flex-grow flex flex-col">
        <DataContext.Provider value={searchRecord}>
          <TypesearchApp />
        </DataContext.Provider>
      </main>
    </>
  );
};

export default TypesearchPage;
