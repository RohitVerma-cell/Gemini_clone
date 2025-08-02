import { useEffect, useState } from "react";

const Answer = ({ ans, index, totalresult }) => {
  const [heading, setHeading] = useState(false);
  const [answer, setAnswer] = useState(ans);

  useEffect(() => {
    if (isHeading(ans)) {
      setHeading(true);
      setAnswer(stripHeadingStars(ans));
    }
  }, [ans]);

  function isHeading(str) {
    return /^\*\*(.*)\*$/.test(str);
  }

  function stripHeadingStars(str) {
    return str.replace(/^\*\*|\*$/g, "").trim();
  }

  return (
    <>
      {index === 0 && totalresult > 1 ? (
        <span className="pt-2 text-xl font-bold block text-white">{answer}</span>
      ) : heading ? (
        <span className="pt-2 text-lg font-semibold block text-white">{answer}</span>
      ) : (
        <span className="pl-5 block text-white">{answer}</span>
      )}
    </>
  );
};

export default Answer;
