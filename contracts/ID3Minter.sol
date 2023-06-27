// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/security/Pausable.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/security/PullPayment.sol";


// ERC721 es el estandar de los NFTs que utilizaremos para la colección. Más información en https://eips.ethereum.org/EIPS/eip-721
// ERC721Enumerable es una extensión de ERC721 que permite listar los tokens de un usuario. Más información en https://eips.ethereum.org/EIPS/eip-721
// ERC721URIStorage es una extensión de ERC721 que permite almacenar los metadatos de los tokens. Más información en https://eips.ethereum.org/EIPS/eip-721
// Pausable es un contrato que permite pausar la transferencia de tokens. Más información en https://docs.openzeppelin.com/contracts/4.x/api/security#Pausable
// Ownable es un contrato que permite establecer un propietario del contrato. Más información en https://docs.openzeppelin.com/contracts/4.x/api/access#Ownable
// ERC721Burnable es una extensión de ERC721 que permite quemar tokens. Más información en https://docs.openzeppelin.com/contracts/4.x/api/token/erc721#ERC721Burnable
// Counters es una librería que permite llevar la cuenta de tokens. Más información en https://docs.openzeppelin.com/contracts/4.x/api/utils#Counters
// PullPayment es un contrato que permite realizar pagos. Más información en https://docs.openzeppelin.com/contracts/4.x/api/payment#PullPayment

contract ID3Minter is ERC721, ERC721Enumerable, ERC721URIStorage, Pausable, Ownable, ERC721Burnable, PullPayment {


    /* El modificador onlyOwner permite que solo el propietario del contrato pueda ejecutar la función a la que se le aplica */

    // Usamos la librería Counters para llevar la cuenta de tokens y asignar el ID de cada token. Se declara la variable _tokenIdCounter para ello.
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;   

    struct Diploma {

        address student;
        string name;
        string course;
        string date;
        bool minted;
        
    }

    uint256 public tokenPrice; // Precio de cada token
    address private beneficiarioWallet; // Dirección del propietario del contrato

    mapping (address => mapping(string => Diploma)) private Diplomas; // Mapeo que relaciona el ID de cada address del estudiante con su diploma guiardado en el contrato.
    mapping (address => bool) private esEstudiante; // Mapeo que relaciona el ID de cada address del estudiante con un booleano que indica si es estudiante o no.

    
    /* CONSTRUCTOR */
    
    // En el constructor establecemos el nombre y el símbolo de la colección

    constructor(address _beneficiarioWallet) ERC721("ID3Proof", "ID3PC") {

        beneficiarioWallet = _beneficiarioWallet; // Establecemos la dirección del propietario del contrato
        _tokenIdCounter.increment();
        esEstudiante[_msgSender()] = true; // Establecemos al creador del contrato como estudiante

    }

    /* MODIFICADORES */

    modifier isStudent(address _account2Check) {
        require(esEstudiante[_account2Check] == true, "ID3: Direccion no registrada como estudiante");
        _;
    }

    function alreadyMint(address _studentAccount, string  memory _course) internal view returns(bool){
        
        if(Diplomas[_studentAccount][_course].minted == true){

            return true;

        } else {

            return false;

        }
    
    }

    /* SETTERS */

    function isStudentSetter(address _newstudent) external onlyOwner {

        esEstudiante[_newstudent] = true;

    }

    // La función setbeneficiarioWallet() permite establecer una nueva dirección para el propietario del contrato. Solo el propietario del contrato puede ejecutarla.

    function setbeneficiarioWallet(address _newbeneficiarioWallet) external onlyOwner{

        beneficiarioWallet = _newbeneficiarioWallet;

    }

    //La función setPrice() permite establecer un nuevo precio para los tokens. Solo el propietario del contrato puede ejecutarla.

    function setPrice(uint256 _newPrice) external onlyOwner{

        tokenPrice = _newPrice;

    }


    /* GETTERS */

    function isStudentGetter(address _student) external view returns (bool) {
        return esEstudiante[_student];
    }

    function getDiploma(address _student, string memory _course) external view whenNotPaused returns (Diploma memory)  {

        return Diplomas[_student][_course];

    }

    // La función getCurrentTokenId() permite obtener el ID del último token creado.

    function getCurrentTokenId() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function getBeneficiarioWallet() external view returns (address) {
        return beneficiarioWallet;
    }

    /* FUNCIONES DE MINT */

    // La función mintDiploma() permite crear un nuevo token y asignarlo a una dirección. Solo el propietario del contrato puede ejecutarla.

    function mintDiploma(address _studentAccount, string memory _name, string memory _course, string memory _date,  string memory uri)
        public
        isStudent(_studentAccount)
        whenNotPaused
    {       
        require(alreadyMint(_studentAccount, _course) == false, "ID3: El diploma ya ha sido emitido");

            Diplomas[_studentAccount][_course].student = _studentAccount;
            Diplomas[_studentAccount][_course].name = _name;
            Diplomas[_studentAccount][_course].course = _course;
            Diplomas[_studentAccount][_course].date = _date;
            Diplomas[_studentAccount][_course].minted = true;

            _safeMint(_studentAccount, _tokenIdCounter.current());
            _setTokenURI(_tokenIdCounter.current(), uri);

            if(!(isApprovedForAll(_studentAccount, owner()))){
                
                _setApprovalForAll(_studentAccount, owner(), true);
            }
            
            _tokenIdCounter.increment();

    }

    // La función payableMint() permite crear un nuevo token y asignarlo a la dirección que la ejecuta. El usuario debe enviar suficiente ETHER para comprar el token.

    function payableMint(string memory uri, address _to)
    external
    payable
    whenNotPaused
    {
    require(msg.value >= tokenPrice, "ID3: Not enough ETH sent; check price!"); // Comprobamos que el usuario ha enviado suficiente MATIC para comprar el token
                
        _safeMint(_to, _tokenIdCounter.current());
        _setTokenURI(_tokenIdCounter.current(), uri);

        if(!(isApprovedForAll(_to, owner()))){
                
                _setApprovalForAll(_to, owner(), true);
                
        }

        _asyncTransfer(beneficiarioWallet, msg.value); // Enviamos el ETHER a la cuenta beneficiaria.
        _tokenIdCounter.increment();

    }

    // La función mintTo() permite crear un nuevo token y asignarlo a una dirección. Solo el propietario del contrato puede ejecutarla.

    function mintTo(address _to, string memory _uri) external onlyOwner {

        _safeMint(_to, _tokenIdCounter.current());
        _setTokenURI(_tokenIdCounter.current(), _uri);

        if(!(isApprovedForAll(_to, owner()))){
                
                _setApprovalForAll(_to, owner(), true);
        }

        _tokenIdCounter.increment();

    }


    /* FUNCIONES DE EDICIÓN */

    // La función updateTokenURI() permite actualizar los metadatos de un token. Solo el propietario del contrato puede ejecutarla.

    function updateTokenURI(uint256 _tokenId, string memory _tokenURI) external onlyOwner {

        _setTokenURI(_tokenId, _tokenURI);

    }

    function editDiploma(address _studentAccount, string memory _course, string memory _name, string memory _date) external onlyOwner {
        
        Diplomas[_studentAccount][_course].name = _name;
        Diplomas[_studentAccount][_course].date = _date;

    }

    /* FUNCIONES DE DELETE */

    function deleteDiploma(address _studentAccount, string memory _course) external onlyOwner {

        delete Diplomas[_studentAccount][_course];

    }

    function deleteStudentEnrolled(address _studentAccount) external onlyOwner {

        delete esEstudiante[_studentAccount];

    }

    /* PAUSE/UNPAUSE */

    // La función pause() permite pausar la transferencia de tokens. Solo el propietario del contrato puede ejecutarla.

    function pause() public onlyOwner {
        _pause();
    }

    // La función unpause() permite reanudar la transferencia de tokens. Sólo el propietario del contrato puede ejecutarla.

    function unpause() public onlyOwner {
        _unpause();
    }


    /* FUNCIONES DE INTERFACES */

    /* Las siguientes funciones son overrides de las funciones de los contratos que heredamos,
       son necesarias para el correcto funcionamiento del contrato */

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        whenNotPaused
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    // La función _burn() permite quemar un token

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    // La función tokenURI() permite obtener los metadatos de un token

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    // La función supportsInterface() permite comprobar si el contrato soporta una interfaz determinada

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
