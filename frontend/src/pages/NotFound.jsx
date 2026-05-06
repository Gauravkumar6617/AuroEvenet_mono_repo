import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="text-8xl font-bold text-[#e85d26]/20 mb-4 font-display">
          404
        </div>
        <h1 className="text-2xl font-bold text-[#1a1814] mb-2 font-display">
          Page not found
        </h1>
        <p className="text-[#6b6358] mb-8 text-sm leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Check the URL or head back home.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/">
            <Button>Back to home</Button>
          </Link>
          <Link to="/blog">
            <Button variant="secondary">Explore blog</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
