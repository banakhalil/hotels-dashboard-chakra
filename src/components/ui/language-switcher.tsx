import React from "react";
import { Button, HStack } from "@chakra-ui/react";
import { useTranslation } from "@/contexts/TranslationContext";

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useTranslation();

  const handleLanguageChange = (newLanguage: "en" | "ar") => {
    setLanguage(newLanguage);
  };

  return (
    <HStack bg="#bedbff" p={1} borderRadius="md">
      <Button
        size="sm"
        variant="ghost"
        onClick={() => handleLanguageChange("en")}
        bg={language === "en" ? "blue.500" : "transparent"}
        color={language === "en" ? "white" : "gray.700"}
        // _hover={{
        //   bg: language === "en" ? "blue.500" : "gray.200",
        // }}
        borderRadius="md"
        px={3}
        py={1}
        fontSize="sm"
        fontWeight="medium"
        mr={1}
      >
        EN
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => handleLanguageChange("ar")}
        bg={language === "ar" ? "blue.500" : "transparent"}
        color={language === "ar" ? "white" : "gray.700"}
        // _hover={{
        //   bg: language === "ar" ? "blue.500" : "blue.200",
        // }}
        borderRadius="md"
        px={3}
        py={1}
        fontSize="sm"
        fontWeight="medium"
      >
        AR
      </Button>
    </HStack>
  );
};
