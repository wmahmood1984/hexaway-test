import React, { useEffect, useState } from 'react';
import { Web3 } from 'web3';
import { bulkContractAdd, bulkAddAbi, testweb3 } from '../config';

const BulkIPFSUploader = () => {
    const contract = new testweb3.eth.Contract(bulkAddAbi, bulkContractAdd);  
    const [arrayFromContract, setArrayFromContract] = useState([]);    
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hashes, setHashes] = useState([]);

useEffect(() => {
    const abc = async () => {
        const web3Hashes = await contract.methods.getArray().call();
        setArrayFromContract(web3Hashes);
    }

    abc();

}, [loading]);

console.log("array",arrayFromContract);


  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const uploadToIPFS = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`https://api.pinata.cloud/pinning/pinFileToIPFS`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
      },
      body: formData,
    });

    const data = await res.json();
    return data.IpfsHash;
  };

  const processUpload = async () => {
    setLoading(true);
    let ipfsHashes = [];

    for (let i = 0; i < files.length; i++) {
      const hash = await uploadToIPFS(files[i]);
      ipfsHashes.push(hash);
    }

    setHashes(ipfsHashes);
    await sendToContract(ipfsHashes);
    setLoading(false);
  };

  const sendToContract = async (list) => {


    const account = testweb3.eth.accounts.privateKeyToAccount(import.meta.env.VITE_PRIVATE_KEY);

    const tx = contract.methods.add(list);

    const gas = await tx.estimateGas({ from: account.address });
    const data = tx.encodeABI();
    const nonce = await testweb3.eth.getTransactionCount(account.address);

    const signedTx = await testweb3.eth.accounts.signTransaction(
      {
        to: bulkContractAdd,
        data,
        gas,
        nonce,
      },
      import.meta.env.VITE_PRIVATE_KEY
    );

    await testweb3.eth.sendSignedTransaction(signedTx.rawTransaction);
  };

  return (
    <div className="p-4 border rounded-md w-full max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-3">Bulk IPFS Uploader</h2>

      <input 
      style={{cursor:"pointer"}}
      type="file" multiple onChange={handleFileChange} className="mb-4" />

      <button
        onClick={processUpload}
        disabled={loading || files.length === 0}
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        {loading ? 'Uploading...' : 'Upload & Send'}
      </button>

      {hashes.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold">Uploaded Hashes:</h3>
          <ul className="list-disc ml-5">
            {hashes.map((h, idx) => (
              <li key={idx}>{h}</li>
            ))}
          </ul>
        </div>
      )}

    {arrayFromContract.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold">Uploaded Images:</h3>
          <ul className="list-disc ml-5">
            {arrayFromContract.map((h, idx) => (
              <img key={idx}
              src={`https://harlequin-biological-bat-26.mypinata.cloud/ipfs/${h}`}
              ></img>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BulkIPFSUploader;
