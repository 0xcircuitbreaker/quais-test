export interface AddressData {
    address: string;
    range: number;
    keystore: string;
}

export interface AllAddressData {
    [key: string]: AddressData;
}

export const allAddressData: AllAddressData = {
    prime: {
      address: "0x00114a47a5d39ea2022dd4d864cb62cfd16879fc",
      range: 0,
      keystore:
        '{"address":"00114a47a5d39ea2022dd4d864cb62cfd16879fc","crypto":{"cipher":"aes-128-ctr","ciphertext":"074dd74224b377c52b309b1cc627c49e49f5ce28829338cda4daa2929b15ebda","cipherparams":{"iv":"b0d55fccc7662ce22998ec8faddb32ca"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"58dbfacb462bae8dc3aacb4106edddf92adb1efb9c87b15c80f9dd879aa764a5"},"mac":"61395396c489455d4e8b8facc03e7a036773e169f428c172a07a05c4b80bb067"},"id":"2bc4ee2f-a67b-4a3a-9497-b4c37adce99b","version":3}',
    },
    "region-0": {
      address: "0x0d79b69c082e6f6a2e78a10a9a49baedb7db37a5",
      range: 1,
      keystore:
        '{"address":"0d79b69c082e6f6a2e78a10a9a49baedb7db37a5","crypto":{"cipher":"aes-128-ctr","ciphertext":"80ba7d3886177f09d9367d7b0bc1d3bdb7cfc9de47b5a2c722f36dc200164907","cipherparams":{"iv":"6b6a7d92edca37b128d04094a20040b1"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"dfb033ea6e6721734a07664695192479e073c3508717af558f58a1ab674e7ccf"},"mac":"37802be16d5bc8fd4dc1a2419d4985b5e428c9407c4d0fd096db7f3a1273932e"},"id":"6d5e2d96-4567-498c-a910-d3d143da326e","version":3}',
    },
    "region-1": {
      address: "0x3bccbe6c6001c46874263169df887cbf5c3580d6",
      range: 5,
      keystore:
        '{"address":"3bccbe6c6001c46874263169df887cbf5c3580d6","crypto":{"cipher":"aes-128-ctr","ciphertext":"9052c14f2ee951394ca1d7d5142842d9b9b055afb2d76bc95141ff126df9d9ab","cipherparams":{"iv":"9879e25d3554332ecb8d107be7b40cc0"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"ae396d0e4265f3a26983fb5975d8d5d0e096c613eb8db4031051f2acf0cabe1d"},"mac":"63edba8a79e97b8d1c1659e703b7bd5a5938810294cc76bc74e05bfe31a79c57"},"id":"787367dc-9066-47bf-b46c-40676817c36b","version":3}',
    },
    "region-2": {
      address: "0x5a457339697cb56e5a9bfa5267ea80d2c6375d98",
      range: 9,
      keystore:
        '{"address":"5a457339697cb56e5a9bfa5267ea80d2c6375d98","crypto":{"cipher":"aes-128-ctr","ciphertext":"c84092e28e79249ae432045f780bdba1eac5a05f5ac4c236832592089cf937cd","cipherparams":{"iv":"d9bd9d6076018db65060200fa5e6dfb1"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"6ebeb735cb9315893127f418a0476d47019de3e38fbbaeb485bc4555c2929399"},"mac":"cc2a16dda741627ed93d0d3a675a598dd11378a5e2fd33c3d71dbfa296a370ad"},"id":"99478d5e-5481-437d-a683-0f2c8699b273","version":3}',
    },
    "zone-0-0": {
      address: "0x1930e0b28d3766e895df661de871a9b8ab70a4da",
      range: 2,
      keystore:
        '{"address":"1930e0b28d3766e895df661de871a9b8ab70a4da","crypto":{"cipher":"aes-128-ctr","ciphertext":"226e19783672e9992841f63865bdc7811b5c69e5d519fbc7479263ef72a32686","cipherparams":{"iv":"522ff11e537d99f339a3601dca3d2dca"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"3622d1e9236a50e883c91560e6b6eb39eb9876abd71ffb606966a3518c2b3f06"},"mac":"47ae36b51f17da31516b67e0b3251a39637b597f9179ebd99eb35247e9f6bd89"},"id":"c2930a59-4bc3-40bb-8a50-d291b081a271","version":3}',
    },
    "zone-0-1": {
      address: "0x246ae82bb49e9dda583cb5fd304fd31cc1b69790",
      range: 3,
      keystore:
        '{"address":"246ae82bb49e9dda583cb5fd304fd31cc1b69790","crypto":{"cipher":"aes-128-ctr","ciphertext":"b39a0ab07234ae3baf7e13ad69fedfcbdefe86efb8a38545ab84d3f8e37b4dc5","cipherparams":{"iv":"5e0c5f9d7cb0824d31a469d585143a80"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"85973417ecd31b954470dc5bf14493950ae0e067d1971af1161cb7ab62078274"},"mac":"c87fab97c01c37f3400909552800e33ec3640194d9de3b6a059ab2499ca5f432"},"id":"1c015233-51b7-4141-a814-24507b1ae6f2","version":3}',
    },
    "zone-0-2": {
      address: "0x2e82bec9c7e47564b9e89b5ab989c0002373c497",
      range: 4,
      keystore:
        '{"address":"2e82bec9c7e47564b9e89b5ab989c0002373c497","crypto":{"cipher":"aes-128-ctr","ciphertext":"6c63d52e85b21cb7f90ecf1566e986fe8ac11bb0c89e4a0627b6419b7d66c2b0","cipherparams":{"iv":"f282fd14de9a8eb195d53544124a55c3"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"c7387e09cea367aa731b9a79eab7082384c5c40edf9a3c0c70e4cce761793bac"},"mac":"71d76dfc443f1d2c01f5b953785ce87309b1b2ad10a0b597f988f830c897e944"},"id":"bd4b02f3-e914-4d48-87df-17d08751311c","version":3}',
    },
    "zone-1-0": {
      address: "0x421bc7323295c6b7f2f75fc4c854d4fb600e69e7",
      range: 6,
      keystore:
        '{"address":"421bc7323295c6b7f2f75fc4c854d4fb600e69e7","crypto":{"cipher":"aes-128-ctr","ciphertext":"5e1fe154c026b8809c3252316af790bf25ccd5b76f35183b1a7460b8aa447d19","cipherparams":{"iv":"2858f1e43288487bd38d84229a46f1fe"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"7b45c1b42bc251dfbb35c194d564c4452671a06695277baacaf6f0ee7b748987"},"mac":"d0bb111e6ac4fd3885dd95e6d623c0840cdb2a98a9fa63882e40a755fdad8fa8"},"id":"d135f644-ef2a-41c7-867d-3ca3c1a14b9d","version":3}',
    },
    "zone-1-1": {
      address: "0x4d6605da9271f8bcea42326a07f3c43f7f67a431",
      range: 7,
      keystore:
        '{"address":"4d6605da9271f8bcea42326a07f3c43f7f67a431","crypto":{"cipher":"aes-128-ctr","ciphertext":"b23848d1574e541cf3f4a45574183e0bfd0ea47cc278966718ba1a582267c876","cipherparams":{"iv":"8b4ce57181cf9de7aeafae282b7e40ec"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"f10f49595a281b9fa68fe06207a5b3fac494f4498576b71dd5a4646eb5dfb264"},"mac":"2a38a6bbd3fd1fee8d78e3d5f680417a1732759ab6759acd8746f8d4ce429aa2"},"id":"9ca07b2b-f68d-4d89-a081-cc5c1a074536","version":3}',
    },
    "zone-1-2": {
      address: "0x59630c586ede320c8d7759f38373564f5f9faf20",
      range: 8,
      keystore:
        '{"address":"59630c586ede320c8d7759f38373564f5f9faf20","crypto":{"cipher":"aes-128-ctr","ciphertext":"02b32e6e618f2a26009ada9d8c358aabf48835efcc6d6111ca271a1f877b09c8","cipherparams":{"iv":"5246d7f07c02abb9c730ebbdc901ad5d"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"3693bc12c430326a6270edc53d2fb7b9ca15d458b9a0bf322ed2d207a14047a2"},"mac":"b0aaf51918033be376b59b4a014bb697d4298774c9c8bb25eb621ec29cc0ece8"},"id":"13a66bcf-78d1-4dc1-8683-b60694e29621","version":3}',
    },
    "zone-2-0": {
      address: "0x6b70b802661a87823a9cb16a8a39763bc8e11de4",
      range: 10,
      keystore:
        '{"address":"6b70b802661a87823a9cb16a8a39763bc8e11de4","crypto":{"cipher":"aes-128-ctr","ciphertext":"5be64689a1de64b5d5476c0859a2e66ddcdc7ff63b7017a54fa19725e6021221","cipherparams":{"iv":"977b5b071ecdb17ecc9bdcdfcaa7d2ef"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"5c194c421261c825ecbac734f861f0048a40c3ab87034b660cf84d3fe4ab6c2c"},"mac":"4007ecb3a618addb2e661c9e6d22c1af35023060451b2c123c83678a76857cab"},"id":"e30c591f-fef2-43b8-b8e7-7518931d9d84","version":3}',
    },
    "zone-2-1": {
      address: "0x70820eb5e384b65caf931e85224601f3203ecd20",
      range: 11,
      keystore:
        '{"address":"70820eb5e384b65caf931e85224601f3203ecd20","crypto":{"cipher":"aes-128-ctr","ciphertext":"d4406ca110ebc6607bca2030ad739cbe31dcf854276ad8e6ee91e64b68de3ad3","cipherparams":{"iv":"96fda462a911616a4e23fcdfb9ef3022"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"8a7739f3d7ce0b07144083af6255ae02eeeac4fa18dbab145bfca187573f8348"},"mac":"e900374677d8371edf47fe7e31c87484491d990401460d7cd93cdef7d701cafd"},"id":"d09ea756-f15a-4909-b057-52ca16dbd02e","version":3}',
    },
    "zone-2-2": {
      address: "0x7f8a6306426b57d13f1e3975d377574e18d7a7a3",
      range: 12,
      keystore:
        '{"address":"7f8a6306426b57d13f1e3975d377574e18d7a7a3","crypto":{"cipher":"aes-128-ctr","ciphertext":"2b4e9a2f51b965d9406907c67ea8033d7dcd59648bc96937a373c996c3b2a50c","cipherparams":{"iv":"d36df6c9707b7adf8b6ebce00dfe8f18"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"344ef80c299d6c8b1dc30e9035a91b4599c901c42592c01f228c751720ba30c8"},"mac":"baf8e231267ba40c38e405522b7432eead9c28d02c8dbed586ea2b2a1a16c55c"},"id":"5faa8ead-a700-4f62-86a9-b3ce24a28ee7","version":3}',
    },
  };