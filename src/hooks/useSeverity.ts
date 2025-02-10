import { useState } from "react";

const useSeverity = () => {
  const [severity, setSeverity] = useState<string | null>(null);

  return { severity, setSeverity };
};

export default useSeverity;
