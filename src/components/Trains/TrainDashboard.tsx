import { Box, Grid, GridItem } from "@chakra-ui/react";

import CardRevenue from "../CardRevenue";
import { SelectedPage } from "@/shared/types";

type Props = { setSelectedPage: (newPage: SelectedPage) => void };

const TrainDashboard = ({ setSelectedPage }: Props) => {
  return (
    // <Card.Root height={"full"} marginX={5}>
    //   <Card.Header />
    //   <Card.Body>
    <section className="min-h-screen py-6">
      <Box
        pb={32}
        height="full"
        width="full"
        maxW={{ base: "container.sm", lg: "container.xl" }}
        px={{ base: 2, md: 4 }}
      >
        <Grid
          h="200px"
          templateRows="repeat(2, 1fr)"
          templateColumns="repeat(5, 1fr)"
          gap={4}
        >
          <GridItem colSpan={1}>
            {/* <Box border="1px" bgColor="green.100">
              colSpan=2
            </Box> */}
            <CardRevenue />
          </GridItem>
          <GridItem colSpan={1}>
            {/* <Box border="1px" bgColor="blue.100">
              colSpan=2
            </Box> */}
            <CardRevenue />
          </GridItem>
          <GridItem colSpan={1}>
            {/* <Box border="1px" bgColor="blue.100">
              colSpan=2
            </Box> */}
            <CardRevenue />
          </GridItem>
          <GridItem colSpan={1}>
            {/* <Box border="1px" bgColor="blue.100">
              colSpan=2
            </Box> */}
            <CardRevenue />
          </GridItem>
          <GridItem rowSpan={2} colSpan={1} height="screen">
            {/* <Box border="1px" bgColor="red.100">
              rowSpan=2
            </Box> */}
            <CardRevenue />
          </GridItem>
          <GridItem colSpan={4}>
            {/* <Box border="1px" bgColor="yellow.100">
              colSpan=4
            </Box> */}
            <CardRevenue />
          </GridItem>
        </Grid>
      </Box>
    </section>
  );
};

export default TrainDashboard;
