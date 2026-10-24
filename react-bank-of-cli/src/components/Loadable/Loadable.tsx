import { Skeleton } from "../ui/skeleton";

type LoadableProps = {
  loading?: boolean;
  skeleton: string; // tailwind classes for the placeholder
  children: React.ReactNode;
};

const Loadable = ({ loading, skeleton, children }: LoadableProps) =>
  loading ? <Skeleton className={`rounded ${skeleton}`} /> : <>{children}</>;
export default Loadable;