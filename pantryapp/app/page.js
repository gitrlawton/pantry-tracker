'use client'
import { Box, Stack, Typography } from '@mui/material'
import { useState, useEffect } from "react"
import {firestore} from "../firebase"
import { collection, getDocs, query } from "firebase/firestore"

const items = ["tomato", "potato", "onion", "garlic", "ginger", "carrot"]

export default function Home() {

const [inventory, setInventory] = useState([])
const [open, setOpen] = useState(false)
const [itemName, setItemName] = useState('')

// Helper functions to fetch inventory from firebase. //

// Async won't block the code when it's fetching.  We don't want the website
// to freeze while it's doing that.
const updateInventory = async () => {
  // Query the database called "inventory" and store its current
  // state as a snapshot.
  const snapshot = query(collection(firestore, "inventory"))
  // Get the documents (boxes) from inside the inventory database.
  const docs = await getDocs(snapshot)
  // Setup the inventory list.
  const inventoryList = []

  // Iterate over each document in the collection of documents (ie. each of
  // boxes in the inventory.
  docs.forEach((doc) => {
    // Push the box object {} to the inventory list.
    inventoryList.push({      
      // Set the name of the object to the document's (aka box's) id.
      name: doc.id,
      // Copy over the rest of its data.
      ...doc.data(),
    })
  })

  setInventory(inventoryList)

}

// Helper function to add an item to the inventory.  Takes in the item
// to increase the quantity of as a paramater.
const addItem = async (item) => {
  const docRef = doc(collection(firestore, "inventory"), item)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    // Get the quantity of the item from the data.
    const {quantity} = docSnap.data()
    await setDoc(docRef, {quantity: quantity - 1})
    }
  else {
    await setDoc(docRef, {quantity: 1})
  }

  await updateInventory()

}

// Helper function to remove an item from the inventory.  Takes in the item
// to reduce quantity of as a paramater.
const removeItem = async (item) => {
  const docRef = doc(collection(firestore, "inventory"), item)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    // Get the quantity of the item from the data.
    const {quantity} = docSnap.data()

    if (quantity == 1) {
      await deleteDoc(docRef)
    }
    else {
      await setDoc(docRef, {quantity: quantity - 1})
    }
  }

  await updateInventory()

}

useEffect(() => {
  updateInventory()
}, [])

// Model helper functions. //
const handleOpen = () => setOpen(true)
const handleClose = () => setOpen(false)

  return (
    <Box 
      width="100vw"
      height="100vh"
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Box 
        border={"1px solid #333"}
      >
        <Box
          width="800px"
          height="100px"
          bgcolor={"#ADD8E6"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Typography
            variant={"h2"}
            color={"#333"}
            textAlign={"center"}
          >
            Pantry Items
          </Typography>
        </Box>
        <Stack
          width="800px"
          height="300px"
          spacing={2}
          overflow={"auto"}
        >
          {items.map((i) => (
            <Box
              key={i}
              width="100%"
              height="300px"
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              bgcolor={"#f0f0f0"}
            >
              <Typography
                variant={"h3"}
                color={"#333"}
                textAlign={"center"}
              >
                { i.charAt(0).toUpperCase() + i.slice(1) }
              </Typography>
            </Box>
          ))}

        </Stack>
      </Box>
    </Box>
  );
}
