import { Card, CardContent, CardHeader } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { motion } from 'framer-motion';

/**
 * SkeletonCard Component
 * A reusable loading placeholder that mimics the shape and size of actual cards.
 */
export function SkeletonCard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-card border-border">
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6 mt-2" />
          <div className="flex gap-2 mt-4">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/**
 * SkeletonProjectCard Component
 * A specialized skeleton for project/item cards with image and metadata.
 */
export function SkeletonProjectCard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-card border-border">
        <div className="p-4 md:p-6 flex flex-col md:flex-row items-start gap-4">
          <Skeleton className="w-full md:w-24 h-32 md:h-16 rounded-md" />
          <div className="flex-grow w-full space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="flex gap-2 mt-4">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

/**
 * SkeletonList Component
 * A list of skeleton items with staggered animation.
 */
export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
        >
          <SkeletonProjectCard />
        </motion.div>
      ))}
    </div>
  );
}
