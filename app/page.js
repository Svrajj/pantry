"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
  IconButton,
} from "@mui/material";
import { firestore } from "@/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

import { Edit, Delete } from "@mui/icons-material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 3,
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemCost, setItemCost] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const addItem = async () => {
    const docRef = doc(collection(firestore, "inventory"), itemName);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity, cost } = docSnap.data();
      await setDoc(docRef, {
        quantity: quantity + itemQuantity,
        cost: itemCost,
      });
    } else {
      await setDoc(docRef, { quantity: itemQuantity, cost: itemCost });
    }
    setItemName("");
    setItemQuantity(1);
    setItemCost(0);
    await updateInventory();
    handleClose();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    await deleteDoc(docRef);
    await updateInventory();
  };

  const handleOpen = () => {
    setItemName("");
    setItemQuantity(1);
    setItemCost(0);
    setEditMode(false);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const editItem = (item) => {
    setItemName(item.name);
    setItemQuantity(item.quantity);
    setItemCost(item.cost);
    setEditMode(true);
    setCurrentItem(item.name);
    setOpen(true);
  };

  const updateItem = async () => {
    const docRef = doc(collection(firestore, "inventory"), currentItem);
    await setDoc(docRef, { quantity: itemQuantity, cost: itemCost });
    await updateInventory();
    handleClose();
  };

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display={"flex"}
      justifyContent={"center"}
      flexDirection={"column"}
      alignItems={"center"}
      gap={2}
    >
      <TextField
        id="search"
        label="Search"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {editMode ? "Edit Item" : "Add Item"}
          </Typography>
          <Stack width="100%" direction={"column"} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              id="quantity"
              label="Quantity"
              type="number"
              variant="outlined"
              fullWidth
              value={itemQuantity}
              onChange={(e) => setItemQuantity(parseInt(e.target.value))}
            />
            <TextField
              id="cost"
              label="Cost"
              type="number"
              variant="outlined"
              fullWidth
              value={itemCost}
              onChange={(e) => setItemCost(parseFloat(e.target.value))}
            />
            <Button
              variant="outlined"
              onClick={() => {
                editMode ? updateItem() : addItem();
              }}
            >
              {editMode ? "Update" : "Add"}
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>
      <Box border={"1px solid #333"} width="800px">
        <Box
          width="100%"
          height="100px"
          bgcolor={"#ADD8E6"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Typography variant={"h2"} color={"#333"} textAlign={"center"}>
            Inventory Items
          </Typography>
        </Box>
        <Stack width="100%" height="300px" spacing={2} overflow={"auto"}>
          {filteredInventory.map(({ name, quantity, cost }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              bgcolor={"#f0f0f0"}
              paddingX={5}
            >
              <Typography variant={"h3"} color={"#333"} textAlign={"center"}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={"h5"} color={"#333"} textAlign={"center"}>
                Quantity: {quantity}
              </Typography>
              <Typography variant={"h5"} color={"#333"} textAlign={"center"}>
                Cost: ${cost}
              </Typography>
              <Stack direction={"row"} spacing={2}>
                <IconButton
                  color="primary"
                  onClick={() => editItem({ name, quantity, cost })}
                >
                  <Edit />
                </IconButton>
                <IconButton color="secondary" onClick={() => removeItem(name)}>
                  <Delete />
                </IconButton>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
