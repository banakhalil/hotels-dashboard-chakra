const theme = {
  styles: {
    global: {
      body: {
        bg: "chakra-body-bg",
        color: "chakra-body-text",
      },
    },
  },
  semanticTokens: {
    colors: {
      "chakra-body-bg": {
        default: "rgb(239, 236, 236)",
        _dark: "#222222",
      },
      "chakra-card-bg": {
        default: "red",
        _dark: "blue",
      },
      "chakra-body-text": {
        default: "gray.800",
        _dark: "whiteAlpha.900",
      },
      "chakra-input-border": {
        default: "gray.300",
        _dark: "gray.600",
      },
    },
  },
  colors: {
    brand: {
      50: "#f7f7f7",
      100: "#e3e3e3",
      200: "#c8c8c8",
      300: "#a4a4a4",
      400: "#808080",
      500: "#666666",
      600: "#515151",
      700: "#434343",
      800: "#383838",
      900: "#171717",
    },
  },
  components: {
    Card: {
      baseStyle: {
        container: {
          bg: "chakra-card-bg",
          boxShadow: {
            default: "0 2px 4px rgba(0,0,0,0.08)",
            _dark: "0 2px 4px rgba(0,0,0,0.2)",
          },
        },
      },
    },
    Button: {
      baseStyle: {
        borderRadius: "md",
      },
      variants: {
        solid: {
          bg: {
            default: "brand.500",
            _dark: "brand.200",
          },
          color: {
            default: "white",
            _dark: "brand.800",
          },
          _hover: {
            bg: {
              default: "brand.600",
              _dark: "brand.300",
            },
          },
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          borderColor: "chakra-input-border",
          _dark: {
            borderColor: "chakra-input-border",
          },
        },
      },
    },
  },
};

export default theme;
