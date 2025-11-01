import React, { useEffect, useState } from 'react'
import { helperAbi, helperAddress, packageKeys, web3 } from '../config';
import { formatAddress } from '../utils/contractExecutor';

export default function User({address1}) {
          const [user, setUser] = useState();
          const [Package, setPackage] = useState();

        const contract = new web3.eth.Contract(helperAbi, helperAddress)
    
        useEffect(() => {
    
            const abc = async () => {
    
                
                const _user = await contract.methods.getUser(address1).call()
                setUser(_user)
                
                const _package = await contract.methods.userPackage(address1).call()
                setPackage(_package)




            }
    
            abc()
        }, [address1])


            const isLoading = !user || !Package;



    if (isLoading) {
        // show a waiting/loading screen
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
                <p className="text-gray-600 text-lg font-medium">Loading your data...</p>
            </div>
        );
    }
  
    return (
                                   <div class="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                                    <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg"><span class="font-bold">A1</span>
                                    </div>
                                    <div class="font-semibold">
                                        {formatAddress(address1)}
                                    </div>
                                    <div class="text-sm text-gray-600">
                                        Package: {packageKeys[Package.id]}
                                    </div>
                                    <div class="text-sm text-green-600 font-medium">
                                        Active
                                    </div>
                                    <div class="text-xs text-gray-500 mt-1">
                                        Direct Referral #{user.direct.length}
                                    </div>
                                </div>

  )
}
