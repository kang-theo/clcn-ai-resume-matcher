import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FeatureProps {
  title: string;
  description: string;
  image?: string;
}

const features: FeatureProps[] = [
  {
    title: "High customization",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi nesciunt est nostrum omnis ab sapiente.",
    image: "https://via.placeholder.com/300",
  },
  {
    title: "Intuitive user interface",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi nesciunt est nostrum omnis ab sapiente.",
    image: "https://via.placeholder.com/300",
  },
  {
    title: "AI-Powered insights",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi nesciunt est nostrum omnis ab sapiente.",
    image: "https://via.placeholder.com/300",
  },
];

const featureList: string[] = [
  "Resume Builder",
  "Intuitive UX",
  "AI-Powered",
  "Feature#4",
];

export const Features = () => {
  return (
    <section id='features' className='container py-24 sm:py-32 space-y-8'>
      <h2 className='text-3xl lg:text-4xl font-bold md:text-center'>
        Many{" "}
        <span className='bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text'>
          Great Features
        </span>
      </h2>

      <div className='flex flex-wrap md:justify-center gap-4'>
        {featureList.map((feature: string) => (
          <div key={feature}>
            <Badge variant='secondary' className='text-sm'>
              {feature}
            </Badge>
          </div>
        ))}
      </div>

      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {features.map(({ title, description, image }: FeatureProps) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>

            <CardContent>{description}</CardContent>
            <CardFooter>
              <img
                src={image}
                alt='About feature'
                className='w-[200px] lg:w-[300px] mx-auto'
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
