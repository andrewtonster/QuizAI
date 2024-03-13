"use client";

import React from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import D3WordCloud from "react-d3-cloud";

type Props = {};

const data = [
  {
    text: "hey",
    value: 3,
  },
  {
    text: "lol",
    value: 13,
  },
  {
    text: "jey",
    value: 5,
  },
  {
    text: "say",
    value: 8,
  },
];

const fontSizeMapper = (word: { value: number }) =>
  Math.log2(word.value) * 5 + 16;

const CustomWordCloud = (props: Props) => {
  // we can get our theme from use THeme
  const theme = useTheme();
  const router = useRouter();
  return (
    <>
      <D3WordCloud
        data={data}
        height={550}
        font="Times"
        fontSize={fontSizeMapper}
        rotate={0}
        padding={10}
        fill={theme.theme === "dark" ? "white" : "black"}
        onWordClick={(e, d) => {
          router.push("/quiz?topic=" + d.text);
        }}
      />
    </>
  );
};

export default CustomWordCloud;
