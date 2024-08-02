'use client'
import { Box, Modal, Stack, Typography, TextField, Button, Autocomplete } from '@mui/material'
import { useState, useEffect } from "react"
import {firestore} from "../firebase"
import { collection, deleteDoc, doc, getDocs, getDoc, setDoc, query } from "firebase/firestore"


export default function Home() {

const [inventory, setInventory] = useState([])
const [open, setOpen] = useState(false)
const [itemName, setItemName] = useState('')
// Search query.
const [searchQuery, setSearchQuery] = useState('');

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
    await setDoc(docRef, {quantity: quantity + 1})
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

// Modal helper functions. //


const handleOpen = () => setOpen(true)

// Closes our database after updating it.
const handleClose = () => setOpen(false)

  return (
    <Box 
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      {/** Modal is the screen that pops up when you click the button. */}
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack
            width="100%"
            direction="row"
            spacing={2} 
          >
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
              }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName("")
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      {/**  */}
      <Autocomplete
        freeSolo
        options={inventory.map(({ name }) => name)}
        onInputChange={(e, newValue) => setSearchQuery(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            style={{ width: '200px' }}
            label="Search Pantry Items"
            variant="outlined"
          />
        )}
        style={{ marginBottom: '5px' }}
      />
      <Box
        border="1px solid #333"
      >
        <Box
          width="800px"
          height="100px"
          bgcolor="#ADD8E6"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography 
            variant="h2"
            color="#333"
          >
            Pantry Items
          </Typography>
        </Box>
        <Stack
          width="800px"
          height="300px"
          spacing={2}
          overflow="auto"
        >
          {
            inventory
            .filter(({ name }) => 
            name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(({ name, quantity }) => (
              <Box 
                key={name}
                width="100%"
                minHeight="150px" 
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgcolor="#f0f0f0"
                padding={5}
              >
                <Typography
                  variant="h3"
                  color="#333"
                  textAlign="left"
                  
                >
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    width="80px" // Set a fixed width to ensure alignment
                  >
                    <Typography
                      variant="h3"
                      color="#333"
                      style={{ marginRight: '16px' }}
                    >
                      {quantity}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    onClick={() => {
                      addItem(name)
                    }}
                  >
                    Add
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      removeItem(name)
                    }}
                  >
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))
          }
        </Stack>
      </Box>  
      <Button
        variant="contained"
        onClick={() => {
          handleOpen()
        }}
      >
        Add New Item
      </Button>
    </Box>
  );
}
