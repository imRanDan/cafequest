import Image from "next/image";
import styles from "./page.module.css";
import { ColorModeScript } from "@chakra-ui/react";
import theme from "./theme";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Header />
    </div>
  );
}
