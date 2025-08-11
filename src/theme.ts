import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  colors: {
    leaf: {
      50: "#f2fbf6",
      100: "#dbf4e5",
      200: "#b7e9cc",
      300: "#8edab0",
      400: "#68cb97",
      500: "#48bb78",
      600: "#3aa265",
      700: "#2f8654",
      800: "#276b45",
      900: "#1f5336",
    },
  },
  components: {
    Button: { defaultProps: { colorScheme: "leaf" } },
    Input: { defaultProps: { focusBorderColor: "leaf.400" } },
    NumberInput: { defaultProps: { focusBorderColor: "leaf.400" } },
    Textarea: { defaultProps: { focusBorderColor: "leaf.400" } },
  },
});
