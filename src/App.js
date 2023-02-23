import {
  Box,
  Button,
  Container,
  Progress,
  Stack,
  Heading,
} from "@chakra-ui/react";
import EtherSlider from "./EtherSlider";
import "./App.css";
import { useState } from "react";
import { ethers } from "ethers";

import progressbarDonation from "./ProgressbarDonation.json";

const progressbarDonationAddress = "0xCFc6D5D027E3487418aff8B141024C13aCeBbE4e";

function App() {
  const [accounts, setAccounts] = useState([]);
  const isConnected = Boolean(accounts[0]);
  const [donationAmount, setDonationAmount] = useState();
  const [totalDonation, setTotalDonation] = useState();

  async function connectAccount() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccounts(accounts);
    }
  }

  async function donate() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        progressbarDonationAddress,
        progressbarDonation.abi,
        signer
      );
      try {
        const response = await contract.donate({
          value: ethers.utils.parseEther(donationAmount.toString()),
        });
        console.log("response : ", response);
        await contract
          .totalDonation()
          .then((newAmount) =>
            setTotalDonation(ethers.utils.formatEther(newAmount))
          );
        console.log("new amount :", totalDonation);
      } catch (err) {
        console.log(err);
      }
    }
  }

  return (
    <div className="App">
      <Container maxW={"3xl"}>
        <Stack
          as={Box}
          textAlign={"center"}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}
        >
          <Heading>{totalDonation} test</Heading>
          <Progress
            width="full"
            height="32px"
            value={(totalDonation / 0.1) * 100}
            colorScheme="pink"
          />

          {isConnected ? (
            <div>
              <EtherSlider
                donationAmount={donationAmount}
                setDonationAmount={setDonationAmount}
              />

              <Button onClick={donate}>Donate amount</Button>
            </div>
          ) : (
            <Button onClick={connectAccount}>Connect</Button>
          )}
        </Stack>
      </Container>
    </div>
  );
}

export default App;
