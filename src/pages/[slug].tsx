import { Suspense } from "react";
import { GetServerSideProps, Metadata } from "next";
import Script from "next/script";
import axios from "axios";
import Head from "next/head";
// export const runtime = "edge";
// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const slug = params.slug;
//   const id = slug.slice(slug.lastIndexOf("-") + 1);
//   const { data: article } = await fetch(
//     "https://api.sportsandtravelonline.com/News/news-detail?id=" + id
//   ).then((res) => res.json());

//   return {
//     title: article.name,
//     metadataBase: new URL(`https://${process.env.VERCEL_URL}`),
//     openGraph: {
//       images: [article.avatarLink],
//     },
//   };
// }
const formatDate = (str: string) => {
  const date = new Date(str);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

export default function Page(data: any) {
  console.log("data", data);
  const article = data.data;
  console.log("111", article)
  return (
    <>
      <Head>
        <title>{article.name}</title>
        <meta property="og:image" content={article.avatarLink} />
        <meta property="og:title" content={article.name} />
      </Head>
      <main>
        {/* <Script src="/qcscript.js" /> */}
        <div className="container-flu">
          <div id="M932897ScriptRootC1569683"></div>
          <script
            src="https://jsc.mgid.com/l/o/lovenews.sportsandtravelonline.com.1569683.js"
            async
          ></script>

          <h1>{article.name}</h1>
          <p className="mb-4 text-lg">
            Posted: {formatDate(article.dateTimeStart)}
          </p>
          <Suspense fallback={<p>Loading ...</p>}>
            <article
              className="content"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </Suspense>
        </div>
        <div id="M932897ScriptRootC1569677"></div>
        <script
          src="https://jsc.mgid.com/l/o/lovenews.sportsandtravelonline.com.1569677.js"
          async
        ></script>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<any> = async ({
  params,
}) => {
  try {
    const response = await axios.get(
      `${process.env.APP_API}/News/news-detail?id=${params?.slug}`
    );
    return {
      props: { data: response.data.data },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: { data: [] as any[] }, // Sử dụng any type cho data
    };
  }
};
