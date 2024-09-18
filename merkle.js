import {StandardMerkleTree} from "@openzeppelin/merkle-tree";
import fs from 'fs';
import csv from 'csv-parser';
import keccak from 'keccak';
//import {MerkleTree} from 'merkletreejs';
//import { getRandomValues } from 'crypto';



const csvFilePath = `./airdropnew.csv`;
const searchAddress = "0x92e827f125f746778b636e06e7bd8efac166b443"; //Address to search

// Function to hash asingle entry using keccak256
// function hashEntry(address, amount) {
//     const amountStr = amount.toString();
//     const dataToHash = address + amountStr;
//     return keccak('keccak256').update(dataToHash).digest();

// }

//Read CSV function
async function readCSV(csvFilePath) {
    const values = [];

    return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data',(row) => {
        values.push([row.address, row.amount])
        //const {address, amount} = row;
       
    })
    .on('end', () => {
        //Construct the Merkle Tree

        resolve(values);
    })
    .on('error', reject);
    });
}

//function to generate the Merkle Tree
async function generateMerkleTree() {
    try{
        const values = await readCSV(csvFilePath);
        const merkletree = StandardMerkleTree.of(values, ["address", "uint256"]);
        console.log('Merkle Root:', merkletree.root);
        fs.writeFileSync("merkletree.json", JSON.stringify(merkletree.dump()));
    } catch (error) {
        console.error()
    }
}

//Generate proof Function
function generateMerkleProof() {
    try {
        const merkletree = StandardMerkleTree.load(
            JSON.parse(fs.readFileSync("merkletree.json", "utf8"))
        );
        for (const[i, v] of merkletree.entries()) {
            if (v[0] === searchAddress) {
                const proof = merkletree.getProof(i);
                console.log("Value:", v);
                console.log("Proof:", proof);
            }
        }
    } catch(error) {
        console.error("Error generating proof:", error)
    }
}

 
//await generateMerkleTree();
//await generateMerkleProof();

export default {generateMerkleTree, generateMerkleProof};