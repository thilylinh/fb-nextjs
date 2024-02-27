import { Suspense, useEffect } from "react";
import { GetServerSideProps } from "next";
import Script from "next/script";
import axios from "axios";
import Head from "next/head";
const formatDate = (str: string) => {
  const date = new Date(str);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

export default function Page(data: any) {
  const article = data.data;
  useEffect(() => {
    const iframe = document.querySelector(".content iframe");

    const handleIframeLoad = () => {
      if (iframe) {
        iframe.style.height = '520px'
        iframe.style.width = '100%'
      }
    };

    if (iframe) {
      iframe.addEventListener("load", handleIframeLoad);

      return () => {
        iframe.removeEventListener("load", handleIframeLoad);
      };
    }
  }, []);
  return (
    <>
      <Head>
        <title>{article.name}</title>
        <meta property="og:image" content={article.avatarLink} />
        <meta property="og:title" content={article.name} />
      </Head>
      <main>
        <Script src="/qcscript.js" />
        <div className="container-flu details">
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

// Memory cache object
const cache = new Map();

export const getServerSideProps: GetServerSideProps<any> = async ({
  params,
}) => {
  try {
    const slug = params?.slug;
    // Check cache first
    if (cache.has(slug)) {
      return {
        props: { data: cache.get(slug) },
      };
    }
    // If not in cache, fetch from API
    const response = await axios.get(
      `${process.env.APP_API}/News/news-detail?id=${params?.slug?.slice(
        params?.slug?.lastIndexOf("-") + 1
      )}`
    );
    // Store in cache for future use (expire in 5 minutes for example)
    cache.set(slug, response.data.data);
    setTimeout(() => cache.delete(slug), 5 * 60 * 1000); // Expire after 5 minutes
    return {
      props: { data: response.data.data },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: { data: [] as any[] }, // Use any type for data
    };
  }
};
