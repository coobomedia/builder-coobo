import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Container from "@/components/container";
import PostBody from "@/components/post-body";
import Header from "@/components/header";
import PostHeader from "@/components/post-header";
import Layout from "@/components/layout";
import PostTitle from "@/components/post-title";
import { builder, BuilderContent, useIsPreviewing } from "@builder.io/react";
import "@builder.io/widgets";
import Meta from "@/components/meta";

// Post model created to display a specific blog post.
// read more at: https://www.builder.io/blog/creating-blog
export default function Post({ post }) {
  const router = useRouter();
  const isPreviewing = useIsPreviewing();
  if (!router.isFallback && !post && !isPreviewing) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
      <Meta />
      <Layout>
        <Container>
          <Header />
          {router.isFallback ? (
            <PostTitle>Loading…</PostTitle>
          ) : (
            <>
              <BuilderContent
                {...(!isPreviewing && { content: post })}
                modelName="post"
                options={{ includeRefs: true }}
              >
                {(data, loading, fullContent) =>
                  data && (
                    <article>
                      {data.author?.value && (
                        <PostHeader
                          title={data.title}
                          coverImage={data.image}
                          date={data.lastUpdated}
                          author={data.author.value?.data}
                        />
                      )}
                      <p>{data.intro}</p>
                      <PostBody content={fullContent} />
                    </article>
                  )
                }
              </BuilderContent>
            </>
          )}
        </Container>
      </Layout>
    </>
  );
}

export async function getStaticProps({ params }) {
  const slug = params.slug;

  /*
    usage of builder sdks to fetch data
    more examples at https://github.com/BuilderIO/builder/tree/main/packages/core  */

  let post =
    (await builder
      .get("post", {
        // Content API params are detailed in this doc
        // https://www.builder.io/c/docs/query-api
        includeRefs: true,
        query: {
          "data.slug": slug,
        },
      })
      .toPromise()) || null;

  return {
    props: {
      post,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 5 seconds
    revalidate: 5,
  };
}

export async function getStaticPaths() {
  const allPosts = await builder.getAll("post", {
    options: { noTargeting: true },
  });
  return {
    paths: allPosts?.map((post) => `/blog/${post.data.slug}`) || [],
    fallback: true,
  };
}
