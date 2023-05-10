// pages/blog/[handle].jsx
import {
  builder,
  BuilderComponent,
  BuilderContent,
  useIsPreviewing,
} from "@builder.io/react";
import Head from "next/head";
import DefaultErrorPage from "next/error";
import React from "react";
import Image from "next/image";

builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY || "");

function BlogArticle({ article }) {
  const isPreviewing = useIsPreviewing();
  if (!article && !isPreviewing) {
    return (
      <>
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        <DefaultErrorPage statusCode={404} />
      </>
    );
  }

  return (
    <BuilderContent
      content={article}
      options={{ includeRefs: true }}
      model="blog-article"
    >
      {(data, loading, fullContent) => (
        <React.Fragment>
          <Head>
            {/* Render meta tags from custom field */}
            <title>{data?.title}</title>
            <meta name="description" content={data?.blurb} />
            <meta name="og:image" content={data?.image} />
          </Head>

          <div>
            <div>{data?.title}</div>
            <Image
              src={data?.image}
              alt={data?.title}
              width={600}
              height={400}
            />
            {/* Render the Builder drag/drop'd content */}
            <div className="prose lg:prose-xl">
              <BuilderComponent
                model="blog-article"
                content={fullContent}
                options={{ includeRefs: true }}
              />
            </div>
          </div>
        </React.Fragment>
      )}
    </BuilderContent>
  );
}

export async function getStaticProps({ params }) {
  const article =
    (await builder
      .get("blog-article", {
        // Include references, like our `author` ref
        options: { includeRefs: true },
        query: {
          // Get the specific article by handle
          "data.handle": params.handle,
        },
      })
      .promise()) || null;

  return {
    props: {
      article,
    },
    revalidate: 5,
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export default BlogArticle;
