import Avatar from "../components/avatar";
import CoverImage from "../components/cover-image";
import Link from "next/link";

type PostCardProps = {
  title: string;
  coverImage: string;
  author?: {
    name: string;
    image: string;
  };
  slug: string;
  intro: string;
};

export default function PostCard({
  title,
  coverImage,
  author,
  slug,
  intro,
}: PostCardProps) {
  return (
    <div className="mx-3">
      <div className="mb-5">
        <CoverImage title={title} slug={slug} url={coverImage} />
      </div>
      <h3 className="text-3xl mb-3 leading-snug">
        <Link className="hover:underline" href={`/blog/${slug}`}>
          {title}
        </Link>
      </h3>
      <p className="text-lg leading-relaxed mb-4">{intro}</p>
      {author && <Avatar name={author.name} picture={author.image} />}
    </div>
  );
}
