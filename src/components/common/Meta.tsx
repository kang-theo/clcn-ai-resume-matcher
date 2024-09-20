import { Metadata } from "next";

type MetadataProps = {
  title?: string;
  description?: string;
};

export const Meta = (props: MetadataProps = {}): Metadata => {
  const {
    title = "AI Resume Matcher",
    description = "Leverage the power of AI to help you find the right talents"
  } = props;
  return {
    title,
    description,
  };
};
