import { useEffect, useState } from "react";
import { AiFillApi, AiOutlinePlus, AiOutlineMinus, AiOutlineEdit } from "react-icons/ai";
import { GrUserAdmin, GrValidate } from "react-icons/gr";
import { BiSolidRightArrow, BiSolidDownArrow, BiSolidBookAlt, BiStats, BiMoneyWithdraw } from "react-icons/bi";
import { IoSettingsOutline } from "react-icons/io5";
import { HiMiniDocumentMagnifyingGlass, HiOutlineDocumentArrowUp, HiOutlineDocumentPlus } from "react-icons/hi2"; 
import { useAuth } from "../context/authContext";


export default function Sidebar({ authorized, activeview, setActiveView, adminview, setadminview }) {

  const [activeMenu, setActiveMenu] = useState("");
  const [activeMainMenu, setActiveMainMenu] = useState("");

  useEffect(() => {
    console.log(authorized);
  }, [authorized, activeview, activeMenu, adminview]);

  const { user, logout } = useAuth();

  return (
    <aside className="w-[370px] bg-white h-5/6 p-8  overflow-auto">
      <div className="flex flex-col w-full gap-3">
        <img onClick={()=>{  setActiveView("dashboard") }} src="/id3logo.svg" className="w-5/12 cursor-pointer" alt="logo" />
        <div className="flex flex-row gap-2 mt-2 pb-2 border-gray-200 border-b-2">
          <BiSolidBookAlt className="text-xl my-auto" />
          <h1 className="text-lg text-left font-semibold">Key concepts</h1>
          { activeMainMenu === "keyconcepts" ?

            <BiSolidDownArrow  
            className="text-base ml-auto my-auto hover:text-gray-400 cursor-pointer"     
            onClick={()=>{
              setActiveMainMenu("");
            }}
            />
            :
            <BiSolidRightArrow
            className="text-base ml-auto my-auto hover:text-gray-400 cursor-pointer" 
            onClick={()=>{
              setActiveMainMenu("keyconcepts");
            }}
            />
          

          }
        </div>

        { activeMainMenu === "keyconcepts" ?
          <ul className="flex flex-col w-full gap-2">

            <li
              onClick={(e) => {
                setActiveView("introduccion");
              }}
              className={`-mx-3 -my-1 ${activeview === "introduccion" ? "bg-gray-400" : "bg-white"}`}
            >
              <p className={`pl-3 py-1 ${activeview === "introduccion" ? "text-white cursor-default" : "cursor-pointer hover:text-gray-400"} text-base`}>
                Smart Contract
              </p>
            </li>

            <li
              onClick={(e) => {
                setActiveView("wallet");
              }}
              className={`-mx-3 -my-1 ${activeview === "wallet" ? "bg-gray-400" : "bg-white"}`}
            >
              <p className={`pl-3 py-1 ${activeview === "wallet" ? "text-white cursor-default" : "cursor-pointer hover:text-gray-400"} text-base`}>
                Wallet
              </p>
            </li>


            <li
              onClick={(e) => {
                setActiveView("gas");
              }}
              className={`-mx-3 -my-1 ${activeview === "gas" ? "bg-gray-400" : "bg-white"}`}
            >
              <p className={`pl-3 py-1 ${activeview === "gas" ? "text-white cursor-default" : "cursor-pointer hover:text-gray-400"} text-base`}>
                Gas
              </p>
            </li>

            <li
              onClick={(e) => {
                setActiveView("mint");
              }}
              className={`-mx-3 -my-1 ${activeview === "mint" ? "bg-gray-400" : "bg-white"}`}
            >
              <p className={`pl-3 py-1 ${activeview === "mint" ? "text-white cursor-default" : "cursor-pointer hover:text-gray-400"} text-base`}>
                Mint
              </p>
            </li>

            <li
              onClick={(e) => {
                setActiveView("storage");
              }}
              className={`-mx-3 -my-1 ${activeview === "storage" ? "bg-gray-400" : "bg-white"}`}
            >
              <p className={`pl-3 py-1 ${activeview === "storage" ? "text-white cursor-default" : "cursor-pointer hover:text-gray-400"} text-base`}>
                Almacenamiento distribuido
              </p>
            </li>

            <li
              onClick={(e) => {
                setActiveView("ipfs");
              }}
              className={`-mx-3 -my-1 ${activeview === "ipfs" ? "bg-gray-400" : "bg-white"}`}
            >
              <p className={`pl-3 py-1 ${activeview === "ipfs" ? "text-white cursor-default" : "cursor-pointer hover:text-gray-400"} text-base`}>
                IPFS
              </p>
            </li>


            <li
              onClick={(e) => {
                setActiveView("about");
              }}
              className={`-mx-3 -my-1 ${activeview === "about" ? "bg-gray-400" : "bg-white"}`}
            >
              <p className={`pl-3 py-1 ${activeview === "about" ? "text-white cursor-default" : "cursor-pointer hover:text-gray-400"} text-base`}>
                Acerca de
              </p>
            </li>


          </ul>
          :
          null
          }

        { 
        authorized && (
          <>

          <div className="flex flex-row gap-2 mt-2 pb-2 border-gray-200 border-b-2">
             <AiFillApi className="text-2xl my-auto" />
             <h1 className="text-lg text-left font-semibold">API Endpoints</h1>
          </div>
          
          <div className="flex flex-row ">
          <p className={`cursor-pointer hover:text-gray-400 text-base`}
            onClick={(e) => {     
              setActiveView("gettersmain");
            }}>Getters</p>
          { activeMenu === "getters" ? 
            <BiSolidDownArrow  
            className="text-base ml-auto my-auto hover:text-gray-400 cursor-pointer"     
            onClick={()=>{
              setActiveMenu("");
            }}
            />
            :
            <BiSolidRightArrow
            className="text-base ml-auto my-auto hover:text-gray-400 cursor-pointer" 
            onClick={()=>{
              setActiveMenu("getters");
            }}
            />
          }
          </div>
          {activeMenu === "getters" && (
            <ul className="flex flex-col w-full gap-2 ml-4 mb-4">
              <li
                onClick={(e) => {     
                  setActiveView("gettokenid");
                }}
                className="">
                <div className={`pl-3 py-1 flex flex-row w-full ${activeview === "gettokenid" ? "bg-gray-400 text-gray-100" : "hover:bg-gray-300 hover:text-gray-500 cursor-pointer"}`}>
                <p className={`${activeview === "gettokenid" ? "text-white cursor-default" : "cursor-pointer"} text-base`}>
                Current Token ID
                </p>
                <p className={`${activeview === "gettokenid" ? "text-white" : "text-green-600 text-base"} text-base ml-auto mr-4`} >
                  GET
                </p>
                </div>
              </li>

              <li
                onClick={(e) => {      
                  setActiveView("gettokenprice");
                }}
                className="">
                <div className={`pl-3 py-1 flex flex-row w-full ${activeview === "gettokenprice" ? "bg-gray-400 text-gray-100" : "hover:bg-gray-300 hover:text-gray-500 cursor-pointer"}`}>
                <p className={`${activeview === "gettokenprice" ? "text-white cursor-default" : "cursor-pointer"} text-base`}>
                Get Token price
                </p>
                <p className={`${activeview === "gettokenprice" ? "text-white" : "text-green-600 text-base"} text-base ml-auto mr-4`}>
                  GET
                </p>
                </div>
              </li>

              <li
                onClick={(e) => {     
                  setActiveView("istudent"); 
                }}
                className="">
                <div className={`pl-3 py-1 flex flex-row w-full ${activeview === "istudent" ? "bg-gray-400 text-gray-100" : "hover:bg-gray-300 hover:text-gray-500 cursor-pointer"}`}>
                <p className={` ${activeview === "istudent" ? "text-white cursor-default" : "cursor-pointer"} text-base`}>
                Is student?
                </p>
                <p className={`${activeview === "istudent" ? "text-white" : "text-green-600 text-base"} text-base ml-auto mr-4`}>
                  GET
                </p>
                </div>
              </li>

              <li
                onClick={(e) => {   
                  setActiveView("getdiploma");   
                }}
                className="">
                <div className={`pl-3 py-1 flex flex-row w-full ${activeview === "getdiploma" ? "bg-gray-400 text-gray-100" : "hover:bg-gray-300 hover:text-gray-500 cursor-pointer"}`}>
                <p className={` ${activeview === "getdiploma" ? "text-white cursor-default" : "cursor-pointer"} text-base`}>
                Get diploma
                </p>
                <p className={`${activeview === "getdiploma" ? "text-white" : "text-green-600 text-base"} text-base ml-auto mr-4`}>
                  GET
                </p>
                </div>
              </li>

              <li
                onClick={(e) => {      
                  setActiveView("getbeneficiary");
                }}
                className="">
                <div className={`pl-3 py-1 flex flex-row w-full ${activeview === "getbeneficiary" ? "bg-gray-400 text-gray-100" : "hover:bg-gray-300 hover:text-gray-500 cursor-pointer"}`}>
                <p className={` ${activeview === "getbeneficiary" ? "text-white cursor-default" : "cursor-pointer"} text-base`}>
                Get beneficiary
                </p>
                <p className={`${activeview === "getbeneficiary" ? "text-white" : "text-green-600 text-base"} text-base ml-auto mr-4`}>
                  GET
                </p>
                </div>
              </li>

              </ul>
              )
          }

          <div className="flex flex-row  pb-2">
          <p className="cursor-pointer hover:text-gray-400 text-base"
          onClick={(e) => {     
            setActiveView("settersmain");
          }}>Setters</p>
          { activeMenu === "setters" ? 
            <BiSolidDownArrow  
            className="text-base ml-auto my-auto hover:text-gray-400 cursor-pointer"     
            onClick={()=>{
              setActiveMenu("");
            }}
            />
            :
            <BiSolidRightArrow
            className="text-base ml-auto my-auto hover:text-gray-400 cursor-pointer" 
            onClick={()=>{
              setActiveMenu("setters");
            }}
            />
          }
          </div>

          {activeMenu === "setters" && (
            <ul className="flex flex-col w-full gap-2 ml-4 mb-4">
              <li
                onClick={(e) => {   
                  setActiveView("setstudent");   
                }}
                className="">
                <div className={`pl-3 py-1 flex flex-row w-full ${activeview === "setstudent" ? "bg-gray-400 text-gray-100" : "hover:bg-gray-300 hover:text-gray-500 cursor-pointer"}`}>
                <p className={` ${activeview === "setstudent" ? "text-white cursor-default" : "cursor-pointer"} text-base`}>
                Set student
                </p>
                <p className={`${activeview === "setstudent" ? "text-white" : "text-green-600 text-base"} text-base ml-auto mr-4`}>
                  POST
                </p>
                </div>
              </li>
              <li
                onClick={(e) => {      
                  setActiveView("setbeneficiarywallet");
                }}
                className="">
                <div className={`pl-3 py-1 flex flex-row w-full ${activeview === "setbeneficiarywallet" ? "bg-gray-400 text-gray-100" : "hover:bg-gray-300 hover:text-gray-500 cursor-pointer"}`}>
                <p className={` ${activeview === "setbeneficiarywallet" ? "text-white cursor-default" : "cursor-pointer"} text-base`}>
                Set beneficiary wallet
                </p>
                <p className={`${activeview === "setbeneficiarywallet" ? "text-white" : "text-green-600 text-base"} text-base ml-auto mr-4`}>
                POST
                </p>
                </div>
              </li>

              <li
                onClick={(e) => {      
                  setActiveView("settokenprice");
                }}
                className="">
                <div className={`pl-3 py-1 flex flex-row w-full ${activeview === "settokenprice" ? "bg-gray-400 text-gray-100" : "hover:bg-gray-300 hover:text-gray-500 cursor-pointer"}`}>
                <p className={`${activeview === "settokenprice" ? "text-white cursor-default" : "cursor-pointer"} text-base`}>
                Set token price
                </p>
                <p className={`${activeview === "settokenprice" ? "text-white" : "text-green-600 text-base"} text-base ml-auto mr-4`}>
                POST
                </p>
                </div>
              </li>

              </ul>
              )
          }

          <div className="flex flex-row  pb-2">
          <p className="cursor-pointer hover:text-gray-400 text-base"
          onClick={(e) => {     
            setActiveView("mintersmain");
          }}>Mint</p>
          { activeMenu === "minters" ? 
            <BiSolidDownArrow  
            className="text-base ml-auto my-auto hover:text-gray-400 cursor-pointer"     
            onClick={()=>{
              setActiveMenu("");
            }}
            />
            :
            <BiSolidRightArrow
            className="text-base ml-auto my-auto hover:text-gray-400 cursor-pointer" 
            onClick={()=>{
              setActiveMenu("minters");
            }}
            />
          }
          </div>

          {activeMenu === "minters" && (
            <ul className="flex flex-col w-full gap-2 ml-4 mb-4">
              <li
                onClick={(e) => {      
                  setActiveView("mintdiploma");
                }}
                className="">
                <div className={`pl-3 py-1 flex flex-row w-full ${activeview === "mintdiploma" ? "bg-gray-400 text-gray-100" : "hover:bg-gray-300 hover:text-gray-500 cursor-pointer"}`}>
                <p className={`${activeview === "mintdiploma" ? "text-white cursor-default" : "cursor-pointer"} text-base`}>
                Mint diploma
                </p>
                <p className={`${activeview === "mintdiploma" ? "text-white" : "text-green-600 text-base"} text-base ml-auto mr-4`}>
                  POST
                </p>
                </div>
              </li>
              <li
                onClick={(e) => {      
                  setActiveView("mintdiplomawithprice");
                }}
                className="">
                <div className={`pl-3 py-1 flex flex-row w-full ${activeview === "mintdiplomawithprice" ? "bg-gray-400 text-gray-100" : "hover:bg-gray-300 hover:text-gray-500 cursor-pointer"}`}>
                <p className={`${activeview === "mintdiplomawithprice" ? "text-white cursor-default" : "cursor-pointer"} text-base`}>
                Mint with price
                </p>
                <p className={`${activeview === "mintdiplomawithprice" ? "text-white" : "text-green-600 text-base"} text-base ml-auto mr-4`}>
                POST
                </p>
                </div>
              </li>

              <li
                onClick={(e) => {      
                  setActiveView("mintfreetoken");
                }}
                className="">
                <div className={`pl-3 py-1 flex flex-row w-full ${activeview === "mintfreetoken" ? "bg-gray-400 text-gray-100" : "hover:bg-gray-300 hover:text-gray-500 cursor-pointer"}`}>
                <p className={`${activeview === "mintfreetoken" ? "text-white cursor-default" : "cursor-pointer"} text-base`}>
                Mint free token
                </p>
                <p className={`${activeview === "mintfreetoken" ? "text-white" : "text-green-600 text-base"} text-base ml-auto mr-4`}>
                POST
                </p>
                </div>
              </li>

              </ul>
              )
          }

          <div className="flex flex-row  pb-2">
          <p className="cursor-pointer hover:text-gray-400 text-base"
          onClick={(e) => {     
            setActiveView("editsmain");
          }}
          >Edits</p>
          { activeMenu === "edits" ? 
            <BiSolidDownArrow  
            className="text-base ml-auto my-auto hover:text-gray-400 cursor-pointer"     
            onClick={()=>{
              setActiveMenu("");
            }}
            />
            :
            <BiSolidRightArrow
            className="text-base ml-auto my-auto hover:text-gray-400 cursor-pointer" 
            onClick={()=>{
              setActiveMenu("edits");
            }}
            />
          }
          </div>

          {activeMenu === "edits" && (
            <ul className="flex flex-col w-full gap-2 ml-4 mb-4">
              <li
                onClick={(e) => {
                  setActiveView("edittokenuri");      
                }}
                className="">
                <div className={`pl-3 py-1 flex flex-row w-full ${activeview === "edittokenuri" ? "bg-gray-400 text-gray-100" : "hover:bg-gray-300 hover:text-gray-500 cursor-pointer"}`}>
                <p className={`${activeview === "edittokenuri" ? "text-white cursor-default" : "cursor-pointer"} text-base`}>
                Edit token URI
                </p>
                <p className={`${activeview === "edittokenuri" ? "text-white" : "text-green-600 text-base"} text-base ml-auto mr-4`}>
                  POST
                </p>
                </div>
              </li>
              <li
                onClick={(e) => {  
                  setActiveView("editdiploma");    
                }}
                className="">
                <div className={`pl-3 py-1 flex flex-row w-full ${activeview === "editdiploma" ? "bg-gray-400 text-gray-100" : "hover:bg-gray-300 hover:text-gray-500 cursor-pointer"}`}>
                <p className={`${activeview === "editdiploma" ? "text-white cursor-default" : "cursor-pointer"} text-base`}>
                Edit diploma
                </p>
                <p className={`${activeview === "editdiploma" ? "text-white" : "text-green-600 text-base"} text-base ml-auto mr-4`}>
                POST
                </p>
                </div>
              </li>

              </ul>
              )
          }

          <div className="flex flex-row  pb-2">
          <p className="cursor-pointer hover:text-gray-400 text-base"
          onClick={(e) => {     
            setActiveView("utilitiesmain");
          }}
          >Utilities</p>
          { activeMenu === "utilities" ? 
            <BiSolidDownArrow  
            className="text-base ml-auto my-auto hover:text-gray-400 cursor-pointer"     
            onClick={()=>{
              setActiveMenu("");
            }}
            />
            :
            <BiSolidRightArrow
            className="text-base ml-auto my-auto hover:text-gray-400 cursor-pointer" 
            onClick={()=>{
              setActiveMenu("utilities");
            }}
            />
          }
          </div>

          {activeMenu === "utilities" && (
            <ul className="flex flex-col w-full gap-2 ml-4 mb-4">
              <li
                onClick={(e) => { 
                  setActiveView("walletbalance");     
                }}
                className="">
                <div className={`pl-3 py-1 flex flex-row w-full ${activeview === "walletbalance" ? "bg-gray-400 text-gray-100" : "hover:bg-gray-300 hover:text-gray-500 cursor-pointer"}`}>
                <p className={`${activeview === "walletbalance" ? "text-white cursor-default" : "cursor-pointer"} text-base`}>
                Wallet online balance
                </p>
                <p className={`${activeview === "walletbalance" ? "text-white" : "text-green-600 text-base"} text-base ml-auto mr-4`}>
                  GET
                </p>
                </div>
              </li>
              <li
                onClick={(e) => {  
                  setActiveView("walletaddress");         
                }}
                className="">
                <div className={`pl-3 py-1 flex flex-row w-full ${activeview === "walletaddress" ? "bg-gray-400 text-gray-100" : "hover:bg-gray-300 hover:text-gray-500 cursor-pointer"}`}>
                <p className={`${activeview === "walletaddress" ? "text-white cursor-default" : "cursor-pointer"} text-base`}>
                Wallet address
                </p>
                <p className={`${activeview === "walletaddress" ? "text-white" : "text-green-600 text-base"} text-base ml-auto mr-4`}>
                GET
                </p>
                </div>
              </li>

              <li
                onClick={(e) => {    
                  setActiveView("pullfunds"); 
                }}
                className="">
                <div className={`pl-3 py-1 flex flex-row w-full ${activeview === "pullfunds" ? "bg-gray-400 text-gray-100" : "hover:bg-gray-300 hover:text-gray-500 cursor-pointer"}`}>
                <p className={`${activeview === "pullfunds" ? "text-white cursor-default" : "cursor-pointer"} text-base`}>
                Pull funds
                </p>
                <p className={`${activeview === "pullfunds" ? "text-white" : "text-green-600 text-base"} text-base ml-auto mr-4`}>
                GET
                </p>
                </div>
              </li>

              <li
                onClick={(e) => {      
                  setActiveView("validatetoken");
                }}
                className="">
                <div className={`pl-3 py-1 flex flex-row w-full ${activeview === "validatetoken" ? "bg-gray-400 text-gray-100" : "hover:bg-gray-300 hover:text-gray-500 cursor-pointer"}`}>
                <p className={`${activeview === "validatetoken" ? "text-white cursor-default" : "cursor-pointer"} text-base`}>
                Validate token
                </p>
                <p className={`${activeview === "validatetoken" ? "text-white" : "text-green-600 text-base"} text-base ml-auto mr-4`}>
                GET
                </p>
                </div>
              </li>

              <li
                onClick={(e) => {   
                  setActiveView("validatetoken");   
                }}
                className="">
                <div className={`pl-3 py-1 flex flex-row w-full ${activeview === "validatetoken" ? "bg-gray-400 text-gray-100" : "hover:bg-gray-300 hover:text-gray-500 cursor-pointer"}`}>
                <p className={`${activeview === "validatetoken" ? "text-white cursor-default" : "cursor-pointer"} text-base`}>
                Validate token
                </p>
                <p className={`${activeview === "validatetoken" ? "text-white" : "text-green-600 text-base"} text-base ml-auto mr-4`}>
                POST
                </p>
                </div>
              </li>

              </ul>
              )
          }

          <div className="flex flex-row  pb-2">
          <p className="cursor-pointer hover:text-gray-400 text-base"
          onClick={(e) => {     
            setActiveView("deletemain");
          }}>Delete</p>
          { activeMenu === "delete" ? 
            <BiSolidDownArrow  
            className="text-base ml-auto my-auto hover:text-gray-400 cursor-pointer"     
            onClick={()=>{
              setActiveMenu("");
            }}
            />
            :
            <BiSolidRightArrow
            className="text-base ml-auto my-auto hover:text-gray-400 cursor-pointer" 
            onClick={()=>{
              setActiveMenu("delete");
            }}
            />
          }
          </div>

          {activeMenu === "delete" && (
            <ul className="flex flex-col w-full gap-2 ml-4 mb-4">
              <li
                onClick={(e) => {
                  setActiveView("deletetoken");      
                }}
                className="">
                <div className={`pl-3 py-1 flex flex-row w-full ${activeview === "deletetoken" ? "bg-gray-400 text-gray-100" : "hover:bg-gray-300 hover:text-gray-500 cursor-pointer"}`}>
                <p className={`${activeview === "deletetoken" ? "text-white cursor-default" : "cursor-pointer"} text-base`}>
                Delete token
                </p>
                <p className={`${activeview === "deletetoken" ? "text-white" : "text-green-600 text-base"} text-base ml-auto mr-4`}>
                POST
                </p>
                </div>
              </li>

              <li
                onClick={(e) => {      
                  setActiveView("deletediploma");
                }}
                className="">
                <div className={`pl-3 py-1 flex flex-row w-full ${activeview === "deletediploma" ? "bg-gray-400 text-gray-100" : "hover:bg-gray-300 hover:text-gray-500 cursor-pointer"}`}>
                <p className={`${activeview === "deletediploma" ? "text-white cursor-default" : "cursor-pointer"} text-base`}>
                Delete diploma
                </p>
                <p className={`${activeview === "deletediploma" ? "text-white" : "text-green-600 text-base"} text-base ml-auto mr-4`}>
                POST
                </p>
                </div>
              </li>

              <li
                onClick={(e) => {      
                  setActiveView("deletestudent");
                }}
                className="">
                <div className={`pl-3 py-1 flex flex-row w-full ${activeview === "deletestudent" ? "bg-gray-400 text-gray-100" : "hover:bg-gray-300 hover:text-gray-500 cursor-pointer"}`}>
                <p className={`${activeview === "deletestudent" ? "text-white cursor-default" : "cursor-pointer"} text-base`}>
                Delete student
                </p>
                <p className={`${activeview === "deletestudent" ? "text-white" : "text-green-600 text-base"} text-base ml-auto mr-4`}>
                POST
                </p>
                </div>
              </li>
              </ul>
              )
          }

          <div className="flex flex-row  pb-2">
          <p className="cursor-pointer hover:text-gray-400 text-base"
          onClick={(e) => {     
            setActiveView("pauseunpausemain");
          }}
          >Pause/Unpause</p>
          { activeMenu === "pauseunpause" ? 
            <BiSolidDownArrow  
            className="text-base ml-auto my-auto hover:text-gray-400 cursor-pointer"     
            onClick={()=>{
              setActiveMenu("");
            }}
            />
            :
            <BiSolidRightArrow
            className="text-base ml-auto my-auto hover:text-gray-400 cursor-pointer" 
            onClick={()=>{
              setActiveMenu("pauseunpause");
            }}
            />
          }
          </div>

          {activeMenu === "pauseunpause" && (
            <ul className="flex flex-col w-full gap-2 ml-4 mb-4">
              <li
                onClick={(e) => {      
                  setActiveView("pausecontract");
                }}
                className="">
                <div className={`pl-3 py-1 flex flex-row w-full ${activeview === "pausecontract" ? "bg-gray-400 text-gray-100" : "hover:bg-gray-300 hover:text-gray-500 cursor-pointer"}`}>
                <p className={`${activeview === "pausecontract" ? "text-white cursor-default" : "cursor-pointer"} text-base`}>
                Pause contract
                </p>
                <p className={`${activeview === "pausecontract" ? "text-white" : "text-green-600 text-base"} text-base ml-auto mr-4`}>
                POST
                </p>
                </div>
              </li>

              <li
                onClick={(e) => {      
                  setActiveView("unpausecontract");
                }}
                className="">
                <div className={`pl-3 py-1 flex flex-row w-full ${activeview === "unpausecontract" ? "bg-gray-400 text-gray-100" : "hover:bg-gray-300 hover:text-gray-500 cursor-pointer"}`}>
                <p className={`${activeview === "unpausecontract" ? "text-white cursor-default" : "cursor-pointer"} text-base`}>
                Unpause contract
                </p>
                <p className={`${activeview === "unpausecontract" ? "text-white" : "text-green-600 text-base"} text-base ml-auto mr-4`}>
                POST
                </p>
                </div>
              </li>



              </ul>
              
              )


              
          }

          { adminview === true && 
              <>
              <div className="flex flex-row gap-2 mt-2 pb-2 border-gray-200 border-b-2">
              <HiMiniDocumentMagnifyingGlass className="text-2xl my-auto" />
              <h1 className="text-lg text-left font-semibold">Smart Contract</h1>
              </div>

              <ul className="flex flex-col w-full gap-2  mb-4">

              <li
                onClick={(e) => {      
                  setActiveView("stats")
                }}
                className="-mx-3 -my-1">
                <div className={`pl-3 py-1 flex flex-row w-full ${activeview === "stats" ? "bg-gray-400 text-gray-100" : "hover:bg-gray-300 hover:text-gray-500 cursor-pointer"}`}>
                <p className="text-base">
                Stats
                </p>
                <div className="font-bold text-gray-900 text-xl ml-auto mr-2 ">
                <BiStats/>
                </div>
                </div>
              </li>

              <li
                onClick={(e) => {     
                  setActiveView("create") 
                }}
                className="-mx-3 -my-1">
                <div className={`pl-3 py-1 flex flex-row w-full ${activeview === "create" ? "bg-gray-400 text-gray-100" : "hover:bg-gray-300 hover:text-gray-500 cursor-pointer"}`}>
                <p className="text-base">
                Create
                </p>
                <div className="font-bold text-gray-900 text-xl ml-auto mr-2 ">
                <AiOutlinePlus/>
                </div>
                </div>
              </li>

              <li
                onClick={(e) => {     
                  setActiveView("edit")  
                }}
                className="-mx-3 -my-1">
                <div className={`pl-3 py-1 flex flex-row w-full ${activeview === "edit" ? "bg-gray-400 text-gray-100" : "hover:bg-gray-300 hover:text-gray-500 cursor-pointer"}`}>
                <p className=" hover:text-gray-400 text-base">
                Edit
                </p>
                <div className="font-bold text-gray-900 text-xl ml-auto mr-2 ">
                <AiOutlineEdit />
                </div>
                </div>
              </li>

              <li
                onClick={(e) => {      
                  setActiveView("delete") 
                }}
                className="-mx-3 -my-1">
                <div className={`pl-3 py-1 flex flex-row w-full ${activeview === "delete" ? "bg-gray-400 text-gray-100" : "hover:bg-gray-300 hover:text-gray-500 cursor-pointer"}`}>
                <p className="text-base">
                Delete
                </p>
                <div className="font-bold text-gray-900 text-xl ml-auto mr-2 ">
                <AiOutlineMinus />
                </div>
                </div>
              </li>

              <li
                onClick={(e) => {    
                  setActiveView("withdraw")   
                }}
                className="-mx-3 -my-1">
                <div className={`pl-3 py-1 flex flex-row w-full ${activeview === "withdraw" ? "bg-gray-400 text-gray-100" : "hover:bg-gray-300 hover:text-gray-500 cursor-pointer"}`}>
                <p className=" text-base">
                Withdraw funds
                </p>
                <div className="font-bold text-gray-900 text-xl ml-auto mr-2 ">
                <BiMoneyWithdraw />
                </div>
                </div>
              </li>

              <li
                onClick={(e) => {     
                  setActiveView("validate")  
                }}
                className="-mx-3 -my-1">
                <div className={`pl-3 py-1 flex flex-row w-full ${activeview === "validate" ? "bg-gray-400 text-gray-100" : "hover:bg-gray-300 hover:text-gray-500 cursor-pointer"}`}>
                <p className=" text-base">
                Validate token
                </p>
                <div className="font-bold text-gray-900 text-xl ml-auto mr-2 ">
                <GrValidate />
                </div>
                </div>
              </li>


              <li
                onClick={(e) => {     
                  setActiveView("settings") 
                }}
                className="-mx-3 -my-1">
                <div className={`pl-3 py-1 flex flex-row w-full ${activeview === "settings" ? "bg-gray-400 text-gray-100" : "hover:bg-gray-300 hover:text-gray-500 cursor-pointer"}`}>
                <p className=" text-base">
                Settings
                </p>
                <div className="font-bold text-gray-900 text-xl ml-auto mr-2 ">
                <IoSettingsOutline />
                </div>
                </div>
              </li>


              </ul>
              </>
          
          }


           <div className="absolute bottom-14 flex flex-row w-[250px] bg-gradient-to-t from-white" > 
              
              <GrUserAdmin onClick={()=>{ setActiveView("adminlogin") }} className="text-2xl cursor-pointer hover:text-gray-400" />
              { user && user.email &&
              <p onClick={()=>{ logout(); setadminview(false); }} className="text-black hover:text-gray-600 cursor-pointer ml-auto">Logout</p>
              }

          </div>

              

          </>
        )
        }


      </div>
    </aside>
  );
}
