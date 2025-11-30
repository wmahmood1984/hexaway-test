// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Import upgradeable versions instead of regular contracts
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

interface IHelper {
    function idPurchasedtime(uint256 id) external view returns (uint256);
}

contract DataFetcherUpgradeable is Initializable, UUPSUpgradeable, OwnableUpgradeable {

    IHelper public helper;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address _owner, address _helper) public initializer {
        __Ownable_init(_owner);
        __UUPSUpgradeable_init();

        helper = IHelper(_helper);
    }

    function updateHelper(address _helper) external onlyOwner {
        helper = IHelper(_helper);
    }

    function getAllPurchasedTimes(uint256[] memory ids)
        external
        view
        returns (uint256[] memory)
    {
        uint256[] memory arr = new uint256[](ids.length);

        for (uint i = 0; i < ids.length; i++) {
            arr[i] = helper.idPurchasedtime(ids[i]);
        }

        return arr;
    }

    function _authorizeUpgrade(address newImpl) internal override onlyOwner {}
}