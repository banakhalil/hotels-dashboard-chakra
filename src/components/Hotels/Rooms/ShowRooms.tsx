"use client";

import useHotels from "@/components/react-query/hooks/useHotels";
import {
  Button,
  HStack,
  Menu,
  Portal,
  Select,
  createListCollection,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Rooms from "./Rooms";
import CreateRoom from "./CreateRoom";
import { HiSortAscending } from "react-icons/hi";

interface Props {
  hotelId: string | null;
}
const ShowRooms = ({ hotelId }: Props) => {
  const { data: hotels, isLoading, error } = useHotels("");

  //   const [hotels, setHotels] = useState<Hotel[]>([])
  const [selectedHotel, setSelectedHotel] = useState<string | undefined>(
    hotelId || ""
  );
  const [isOpen, setIsOpen] = useState(false);
  const items = [
    { label: "No Sorting", value: "" },
    { label: "Highest Price", value: "?sort=-pricePerNight" },
    { label: "Lowest Price", value: "?sort=pricePerNight" },
    { label: "Room Type", value: "?sort=roomType" },
    { label: "Availability", value: "?sort=isAvailable" },
  ];
  const [value, setValue] = useState("");
  // Create collection from fetched hotels
  const hotelCollection = createListCollection({
    items:
      hotels?.map((hotel) => ({
        label: hotel.name,
        value: hotel._id,
      })) ?? [],
  });
  useEffect(() => {
    if (hotelId) {
      setSelectedHotel(hotelId);
    }
  }, [hotelId]);
  if (isLoading && !selectedHotel) {
    return <div>Loading hotels...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // if (hotelId !== null) {
  //   return (
  //     <>
  //       <HStack paddingX={14} paddingY={4} gap={8} justify="space-between">
  //         <Select.Root
  //           collection={hotelCollection}
  //           size="sm"
  //           width="320px"
  //           defaultValue={[hotelId]}
  //           // onValueChange={(v) => {
  //           //   // Take the first item if it's an array, or use the value directly
  //           //   const value = Array.isArray(v.value) ? v.value[0] : v.value;
  //           //   console.log(value);
  //           //   setSelectedHotel(hotelId);
  //           // }}
  //           onValueChange={(v) => {
  //             console.log(v, v.value[0]);
  //             setSelectedHotel(v.value[0]);
  //           }}
  //         >
  //           {/* <Select.HiddenSelect /> */}

  //           {/* <Select.Label>Select Hotel</Select.Label> */}
  //           <Select.Control>
  //             <Select.Trigger>
  //               <Select.ValueText placeholder="Select a hotel to view rooms" />
  //             </Select.Trigger>
  //             <Select.IndicatorGroup>
  //               <Select.Indicator />
  //             </Select.IndicatorGroup>
  //           </Select.Control>
  //           <Portal>
  //             <Select.Positioner>
  //               <Select.Content>
  //                 {hotelCollection.items.map((hotel) => (
  //                   <Select.Item item={hotel} key={hotel.value}>
  //                     {hotel.label}
  //                     <Select.ItemIndicator />
  //                   </Select.Item>
  //                 ))}
  //               </Select.Content>
  //             </Select.Positioner>
  //           </Portal>
  //         </Select.Root>
  //         <HStack>
  //           <Menu.Root>
  //             <Menu.Trigger asChild>
  //               <Button variant="outline" size="sm" width="fit-content">
  //                 <HiSortAscending /> Sort
  //               </Button>
  //             </Menu.Trigger>
  //             <Portal>
  //               <Menu.Positioner>
  //                 <Menu.Content minW="10rem">
  //                   <Menu.RadioItemGroup
  //                     value={value}
  //                     onValueChange={(e) => setValue(e.value)}
  //                   >
  //                     {items.map((item) => (
  //                       <Menu.RadioItem key={item.value} value={item.value}>
  //                         {item.label}
  //                         <Menu.ItemIndicator />
  //                       </Menu.RadioItem>
  //                     ))}
  //                   </Menu.RadioItemGroup>
  //                 </Menu.Content>
  //               </Menu.Positioner>
  //             </Portal>
  //           </Menu.Root>
  //           <Button bgColor="firebrick" onClick={() => setIsOpen(true)}>
  //             Add Room
  //           </Button>
  //         </HStack>
  //         <CreateRoom
  //           isOpen={isOpen}
  //           onClose={() => setIsOpen(false)}
  //           hotelId={hotelId}
  //         />
  //       </HStack>
  //       <Rooms hotelId={hotelId} sortValue={value} />;
  //     </>
  //   );
  // }

  return (
    <>
      <HStack
        width="1150px"
        marginX="auto"
        paddingY={2}
        gap={8}
        justify="space-between"
      >
        <Select.Root
          className="drawer"
          borderRadius="md"
          borderWidth="1px"
          collection={hotelCollection}
          size="sm"
          width="320px"
          value={selectedHotel ? [selectedHotel] : []}
          onValueChange={(v) => {
            // Take the first item if it's an array, or use the value directly
            const value = Array.isArray(v.value) ? v.value[0] : v.value;
            console.log(value);
            setSelectedHotel(value);
          }}
        >
          {/* <Select.HiddenSelect /> */}

          {/* <Select.Label>Select Hotel</Select.Label> */}
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="Select a hotel to view rooms" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content className="drawer">
                {hotelCollection.items.map((hotel) => (
                  <Select.Item item={hotel} key={hotel.value}>
                    {hotel.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
        {selectedHotel && (
          <>
            <HStack>
              <Menu.Root>
                <Menu.Trigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    width="fit-content"
                    className="sort-button-color"
                    bgColor="#a2d5cb"
                    color="#0b4f4a"
                    height={10}
                  >
                    <HiSortAscending /> Sort
                  </Button>
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content minW="10rem" className="drawer">
                      <Menu.RadioItemGroup
                        value={value}
                        onValueChange={(e) => setValue(e.value)}
                      >
                        {items.map((item) => (
                          <Menu.RadioItem key={item.value} value={item.value}>
                            {item.label}
                            <Menu.ItemIndicator />
                          </Menu.RadioItem>
                        ))}
                      </Menu.RadioItemGroup>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
              <Button
                // bgColor="rgb(0,54,49)"
                // bgColor="#372aac"
                className="button-color"
                height={10}
                onClick={() => setIsOpen(true)}
              >
                Add Room
              </Button>
            </HStack>
          </>
        )}
        <CreateRoom
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          hotelId={selectedHotel ? selectedHotel : ""}
        />
      </HStack>

      {/* Display hotel data when available */}
      {isLoading && selectedHotel && <div>Loading hotel data...</div>}

      {selectedHotel && <Rooms hotelId={selectedHotel} sortValue={value} />}
    </>
  );
};

export default ShowRooms;
