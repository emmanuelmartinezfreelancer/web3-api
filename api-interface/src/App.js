import Sidebar from './components/Sidebar';
import { useState, useEffect  } from "react";
import { useAuth } from "./context/authContext";
import { UseOnceCollection } from './components/UseOnceCollection';
import { Alert } from "./components/Alert";


function App() {

  const [activeView, setActiveView] = useState('dashboard');
  const [ jsonPassword, setjsonPassword ] = useState('');
  const [ authorized, setAuthorized ] = useState(false);
  const [error, setError] = useState("");
  const [adminView, setadminView] = useState(false)
  

  const password = "123456";

  const adminsCollection = UseOnceCollection('admin');;

  useEffect(() => {
    console.log("Autorizada", authorized);
  }, [authorized, activeView, adminsCollection.length]);


  const { user, logout } = useAuth();
  
  const { login, loginWithGoogle, resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(user.email, user.password);

    } catch (error) {
        if (error.code === "auth/internal-error"){
                
            setError("Correo inválido/Introduce un password");

        } else if(error.code === "auth/user-not-found" ) {

            setError("El usuario no existe")

        } else if(error.code === "auth/wrong-password") {
        
            setError("Contraseña incorrecta")
        } 
    }
  };


  const handleGoogleSignin = async () => {

    let adminsCollectionMail = [];

    for (let admin of adminsCollection) {
      if (admin.email) {
        adminsCollectionMail.push(admin.email);
      }
    }

    try {
      console.log("adminsCollection", adminsCollectionMail);
    
      await loginWithGoogle().then((result) => {
        const user = result.user;
    
        if (adminsCollectionMail.includes(user.email)) {
          setadminView(true)
          //setActiveView("dashboard");
          console.log("Autorizado")
        } else {
          logout();
          setError("No tienes permisos de administrador");
          setTimeout(() => {
            setError("");
          }
          , 4000);
        }
      }).catch((error) => {
        console.error('Error during login:', error);
      });
    
    } catch (error) {
      setError(error.message);
    }
  };

  const handleResetPassword = async (e) => {
  e.preventDefault();
  if (!user.email) return setError("Write an email to reset password");
  try {
    await resetPassword(user.email);
    setError('We sent you an email. Check your inbox')
  } catch (error) {
    setError(error.message);
  }
};

  const parseJson = (content) => {
    try {
      const data = JSON.parse(content);
      const passwordJSON = data.password;

      if(passwordJSON === password) {

        setjsonPassword(passwordJSON);
        setAuthorized(true);
        setActiveView("dashboard")

      } else {

        setjsonPassword('');
        setAuthorized(false);
      
      }
      
    } catch (error) {
      console.error('Error parsing JSON file:', error);
    }
  };
  

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
  
    reader.onload = (e) => {
      const content = e.target.result;
      parseJson(content);
    };
  
    reader.readAsText(file);
  };


  return (

    <div className="App">
      <main className="w-full h-screen flex flex-row">

          <Sidebar authorized = {authorized} activeview= { activeView } setActiveView = { setActiveView } adminview= { adminView } setadminview= { setadminView } />

          { 

          activeView === 'dashboard' && 

          <div className="flex flex-col w-full h-screen bg-gray-100 p-16 items-center justify-center gap-6">

            { !authorized ? 
            <>
            <h1 className="text-2xl font-light text-center">
                Hola, por favor abre el JSON con el password para desbloquear la interfaz.
            </h1>
            <div className="w-1/2 flex justify-center border-gray-900 border-[1px] hover:border-gray-600 rounded-xl py-3">
                <input
                className="py-2 px-4 text-black rounded-md font-semibold transition-colors duration-300"
                type="file"
                onChange={ handleFileChange }
                />
            </div>

            </>

            :

            <>
            <h1 className="text-4xl font-semibold pt-16 pl-10 uppercase">
              ¡Bienvenido/a al mundo de la Web 3.0!
            </h1>
            <h1 className="text-2xl font-light text-center">
                Con esta API puedes gestionar el Smart Contract de ID3, <br />utiliza el submenú para documentarte y utilizarla.
            </h1>

            </>

          }
         </div>

        }

        { 

        activeView === 'introduccion' &&
            <div className="flex flex-col w-full h-screen bg-gray-100 pl-16 pt-16 gap-6 pr-36">

            <p className="text-2xl font-light pl-3 mt-16 py-3 ml-10 border-gray-900 border-[1px] hover:border-gray-600 rounded-xl w-[310px] ">¿Qué es un Smart Contract?</p>
            <p className="pl-10 text-xl">Un contrato inteligente, o "smart contract", es un programa de computadora que facilita, verifica, ejecuta y hace cumplir la negociación o el cumplimiento de un contrato. <span className="font-semibold">Los contratos inteligentes permiten la realización de transacciones y acuerdos creíbles sin la necesidad de terceros.</span>
              <br />
              <br />
              Fueron popularizados por la plataforma Ethereum, que ofrece un lenguaje de programación Turing-completo que permite la creación de estos contratos.
              <br />
              <br />
              Los contratos inteligentes tienen muchas aplicaciones, desde las más simples como el envío de dinero de una persona a otra, hasta las más complejas como las operaciones en las finanzas descentralizadas (DeFi) o los tokens no fungibles (NFT).
              <br />
              <br />
              A pesar de su utilidad, también tienen sus riesgos y desafíos. Por ejemplo, una vez que un contrato inteligente es desplegado en la cadena de bloques, no puede ser alterado, por lo que cualquier error en su programación puede llevar a pérdidas económicas significativas. También existen preocupaciones sobre la seguridad y la privacidad, ya que las transacciones en la cadena de bloques son públicas.
              <br />
              <br />
              Es importante mencionar que, aunque su nombre incluye la palabra "contrato", los contratos inteligentes no tienen que estar necesariamente vinculados con una obligación legal o un acuerdo entre partes, en algunos casos son simplemente instrucciones programadas para realizar ciertas acciones en la cadena de bloques.</p>
          </div>

        }

        {
        activeView === 'wallet' && 

        <div className="flex flex-col w-full h-screen bg-gray-100 pl-16 pt-16 gap-6 pr-36">
        <p className="text-2xl font-light pl-3 mt-16 py-3 ml-10 border-gray-900 border-[1px] hover:border-gray-600 rounded-xl w-[240px] ">¿Qué es una Wallet?</p>
        <p className="pl-10 text-xl">
        Una "wallet" o billetera (a veces llamada monedero en español) en el contexto de las criptomonedas es un medio de almacenar información digital para administrar las monedas o NFTs que un usuario posee.
        <br />
        <br />
        Hay dos componentes clave en una wallet de criptomonedas: las claves privadas y las direcciones públicas. La dirección pública es como la dirección de correo electrónico de alguien, es la dirección que compartes con otros para que puedan enviarte criptomonedas. La clave privada, en cambio, es como la contraseña de tu correo electrónico. Es lo que necesitas para acceder y gestionar tus fondos. Por seguridad, la clave privada debe mantenerse en secreto ya que cualquier persona con acceso a ella podría controlar las criptomonedas asociadas.
        <br />
        <br />
        Existen diferentes tipos de wallets, incluyendo:
        <br />
        <br />
        <span className="font-semibold">
        Wallets de software: </span> Son aplicaciones que puedes instalar en tu computadora o en tu teléfono. Algunas de estas billeteras permiten el control total por parte del usuario, mientras que otras confían en un tercero para su custodia.
        <br />
        <br />
        <span className="font-semibold">
        Wallets de hardware:</span> Son dispositivos físicos que almacenan las claves privadas de un usuario de forma offline, proporcionando una capa adicional de seguridad. Son resistentes a los ataques de hackers, ya que las claves privadas nunca abandonan el dispositivo y por lo tanto nunca están expuestas a internet.
        <br />
        <br />
        <span className="font-semibold">
        Wallets online o en la nube: </span>Estas wallets se ejecutan en la nube y son accesibles desde cualquier dispositivo de computación en cualquier lugar. Aunque son muy convenientes, también almacenan las claves privadas online y están controladas por un tercero, lo que las hace más vulnerables a los ataques de hackers y al robo.
        
        <br />
        <br />
        <span className="font-semibold">
        Wallets de papel:
        </span> Este es un método de almacenamiento en frío donde las claves privadas y públicas se imprimen en un pedazo de papel que se almacena en un lugar seguro. Sin embargo, puede ser menos conveniente para realizar transacciones frecuentes y también puede ser dañado o perdido.
        <br />
        <br />
        Es importante investigar y entender los diferentes tipos de wallets y elegir el que mejor se adapte a tus necesidades y nivel de confort en términos de seguridad y conveniencia.
        </p>
        </div>
        }

        {
        activeView === 'gas' && 

        <div className="flex flex-col w-full h-screen bg-gray-100 pl-16 pt-16 gap-6 pr-36">
        <p className="text-2xl font-light pl-3 mt-16 py-3 ml-10 border-gray-900 border-[1px] hover:border-gray-600 rounded-xl w-[190px] ">¿Qué es el gas?</p>
        <p className="pl-10 text-xl">
        Usemos como ejemplo el contexto de la red Ethereum, "gas" se refiere a la unidad que mide la cantidad de esfuerzo computacional que se requiere para ejecutar operaciones específicas, como enviar transacciones o ejecutar contratos inteligentes. Cuando realizas una acción en Ethereum, como enviar Ether (la criptomoneda nativa de Ethereum) o interactuar con un contrato inteligente, necesitas pagar una tarifa de gas para compensar a los validadores por el uso de la red.
        <br />
        <br />
        Ethereum ha migrado a un sistema de consenso llamado Prueba de Participación (PoS), en el cual los validadores son seleccionados para proponer y validar bloques basándose en la cantidad de Ether que están dispuestos a 'apostar' como garantía, en lugar del sistema anterior de Prueba de Trabajo (PoW), que dependía de la potencia de cómputo para la minería. 
        <br />
        <br />
        La razón de estas tarifas de gas es triple:
        <br />
        <br />    
        <span className="font-semibold">   
        1.Remuneración a los validadores:</span> Los validadores que proponen y validan bloques en la cadena de bloques deben ser compensados por el trabajo que realizan.
        <br />
        <br />       
        <span className="font-semibold">
        2.Prevenir el spam en la red:</span> Si no hubiera costos asociados con la ejecución de transacciones o contratos, alguien podría sobrecargar fácilmente la red con transacciones inútiles, lo que ralentizaría el sistema para todos los demás.
        <br />
        <br />       
        <span className="font-semibold">
        3.Limitar los recursos computacionales:</span> Dado que cada operación en la red Ethereum requiere una cierta cantidad de recursos computacionales, el gas sirve para limitar el número de operaciones y garantizar que la red no se sobrecargue.
        <br />
        <br />        
        El precio del gas se mide en "gwei", que es una fracción de Ether (1 Ether es igual a 1,000,000,000 gwei). El precio del gas fluctúa basado en la demanda de la red. Cuando la red está muy ocupada, las tarifas de gas tienden a ser más altas. Los usuarios pueden ajustar la cantidad de gas que están dispuestos a pagar, pero hay que tener en cuenta que si se ofrece una tarifa de gas muy baja, es posible que la transacción tarde más en ser procesada ya que los validadores tienen preferencia por las transacciones con mayores tarifas.
        <br />
        <br />        
        La cantidad total de gas que se paga por una transacción se calcula multiplicando la cantidad de gas que se utiliza por el precio del gas en gwei.   
        </p>
        </div>

        }

        {
        activeView === 'about' && 

        <div className="flex flex-col w-full h-screen bg-gray-100 pl-16 pt-16 gap-6 pr-36">
        <p className="text-2xl font-light pl-3 mt-16 py-3 ml-10 border-gray-900 border-[1px] hover:border-gray-600 rounded-xl w-[300px] ">¿Cómo funciona esta API?</p>
        <p className="pl-10 text-xl">
          Funciona bien
        </p>
        </div>

        }


        {
        activeView === 'mint' && 

        <div className="flex flex-col w-full h-screen bg-gray-100 pl-16 pt-16 gap-6 pr-36">
        <p className="text-2xl font-light pl-3 mt-16 py-3 ml-10 border-gray-900 border-[1px] hover:border-gray-600 rounded-xl w-[220px] ">¿Qué es "mintear"?</p>
        <p className="pl-10 text-xl">
        "Mintear" es simplemente la traducción al español del término inglés "minting" que, en el contexto de las criptomonedas y la tecnología blockchain, se refiere al proceso de creación de nuevos tokens.
        <br />
        <br />
        Para las criptomonedas, "mintear" se refiere a la creación de nuevas monedas. Este es un término comúnmente utilizado en la minería de criptomonedas, donde los mineros obtienen nuevas monedas como recompensa por su trabajo de validar y registrar las transacciones en la cadena de bloques.
        <br />
        <br />
        En el caso de los tokens no fungibles (NFTs), "mintear" se refiere a la creación de un nuevo NFT en la cadena de bloques. Al mintear un NFT, estás registrando en la blockchain la propiedad de un activo digital único, proporcionando una prueba irrefutable de autenticidad y propiedad.   
        <br />
        <br />
        Cada vez que se mintea un token o una moneda, se genera una transacción que se graba en la blockchain, proporcionando un rastro transparente y seguro de la creación del nuevo token o moneda.
        </p>
        </div>

        }

        {
        activeView === 'storage' && 

        <div className="flex flex-col w-full h-screen bg-gray-100 pl-16 pt-16 gap-6 pr-36">

        <p className="text-2xl font-light pl-3 mt-16 py-3 ml-10 border-gray-900 border-[1px] hover:border-gray-600 rounded-xl w-[440px]">¿Qué es el almacenamiento distribuido?</p>
        <p className="pl-10 text-xl">
        El almacenamiento distribuido es un sistema en el que los datos se almacenan en una red de múltiples nodos, en lugar de en un solo lugar central. Cada nodo en la red mantiene una copia de los datos o una porción de los datos. Este enfoque tiene varios beneficios, como la redundancia (si un nodo falla, los datos aún están disponibles en otros nodos), la resistencia a ataques y censura, y la posibilidad de acceder y recuperar datos más rápidamente desde el nodo más cercano.
        <br />
        <br />
        La tecnología blockchain es un tipo de sistema de almacenamiento distribuido. En una blockchain, todas las transacciones se registran en bloques que se enlazan entre sí para formar una cadena. Cada nodo en la red blockchain mantiene una copia de toda la cadena de bloques, por lo que la información es altamente resistente a la censura y a la manipulación, y no hay un único punto de falla.
        <br />
        <br />
        En la práctica, el almacenamiento distribuido en blockchains se utiliza para una variedad de propósitos, desde mantener un registro seguro de las transacciones de criptomonedas hasta almacenar datos para contratos inteligentes y aplicaciones descentralizadas (dApps).
        <br />
        <br />
        Es importante mencionar que debido al costo y a la capacidad limitada de almacenamiento en las blockchains, a menudo se utilizan en combinación con otras soluciones de almacenamiento distribuido, como IPFS (InterPlanetary File System), para almacenar datos que son demasiado grandes para la blockchain. En estos casos, la blockchain puede utilizarse para almacenar pequeñas piezas de información que verifican la integridad y la propiedad de los datos almacenados en otra parte.
        
        </p>

        </div>

        }

        {
        activeView === 'ipfs' && 

        <div className="flex flex-col w-full h-screen bg-gray-100 pl-16 pt-16 gap-6 pr-36">

        <p className="text-2xl font-light pl-3 mt-16 py-3 ml-10 border-gray-900 border-[1px] hover:border-gray-600 rounded-xl w-[74px]">IPFS</p>
        <p className="pl-10 text-xl">
        IPFS, o el Sistema de Archivos Interplanetario (InterPlanetary File System), es un protocolo de red y un sistema de archivos que está diseñado para hacer que la web sea más rápida, segura y abierta. IPFS es una forma de almacenamiento y acceso a datos, sitios web, aplicaciones y más, de manera descentralizada y distribuida.
        <br />
        <br />
        El protocolo IPFS cambia la forma en que los datos se almacenan y se mueven alrededor de la web. En lugar de depender de ubicaciones específicas y centralizadas para alojar los datos (como ocurre con el protocolo HTTP que la web utiliza ampliamente), IPFS se basa en un sistema de archivos distribuido que localiza los datos basándose en su contenido, no en su ubicación. Esto se conoce como direccionamiento por contenido.
        <br />
        <br />
        Cuando se carga un archivo a IPFS, se divide en bloques y se le asigna una identificación única llamada hash criptográfico. Este hash es una representación del contenido del archivo y no cambia a menos que el contenido del archivo cambie. Así, los usuarios pueden solicitar y acceder a los archivos en la red IPFS usando estos hashes, sin importar dónde estén almacenados físicamente.
        <br />
        <br />
        El IPFS se utiliza en una variedad de aplicaciones, desde la distribución descentralizada de contenido hasta la creación de sitios web completamente distribuidos. En el contexto de blockchain y criptomonedas, IPFS se utiliza a menudo en combinación con Ethereum y otras cadenas de bloques para almacenar datos que son demasiado grandes para almacenar directamente en la cadena de bloques.
        <br />
        <br />
        Por ejemplo, en el caso de los tokens no fungibles (NFT), a menudo se utiliza IPFS para almacenar la información o el contenido del arte digital que representa el NFT, mientras que la propiedad del NFT se registra en la cadena de bloques de Ethereum.
          
        </p>

        </div>

        }

        { authorized && activeView === 'gettersmain' && 

        <div className="flex flex-col w-full h-screen bg-gray-100 pl-16 pt-16 gap-6 pr-36">       
        <p className="text-2xl font-light  mt-16 py-3 ml-10 border-gray-900 border-b-[1px] hover:border-gray-600 w-[74px]">Getters</p>
        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        <br />
        Donec erat nibh, dictum id lacus at, feugiat rhoncus lacus. Maecenas dictum justo quis leo lobortis dictum. Fusce fermentum porta elit sed ornare. Praesent sapien risus, molestie luctus eleifend sed, malesuada eget tortor. Cras viverra lacinia libero id hendrerit. Sed urna nunc, mollis sit amet nibh ac, iaculis tempus odio. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin a metus sollicitudin dolor rhoncus euismod. Donec ullamcorper varius quam et venenatis. 
        </p>

        <div className="w-full bg-sky-950 rounded-xl p-14 h-[330px] text-white text-lg ml-10">
          <p>
          {`try {`}<br></br>
          {`let currentToken = await contractID3.methods.getCurrentTokenId().call({ from:accounts[0]})`}<br></br>
          {`return currentToken;`}<br></br>
          {`} catch (error) {`}
          <br></br>
          {`console.error(error);`}
          <br></br>
          {`} finally {`}
          <br></br>
          {`console.log('Finally');`}
          <br></br>
          {`}`}
          </p>
        </div>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        </p>
        </div>
        
        }

        { authorized && activeView === 'gettokenid' && 

        <div className="flex flex-col w-full h-screen bg-gray-100 pl-16 pt-16 gap-6 pr-36">       
        <p className="text-2xl font-light  mt-16 py-3 ml-10 border-gray-900 border-b-[1px] hover:border-gray-600 w-[74px]">/getcurrenttoken</p>
       
        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        <br />
        Donec erat nibh, dictum id lacus at, feugiat rhoncus lacus. Maecenas dictum justo quis leo lobortis dictum. Fusce fermentum porta elit sed ornare. Praesent sapien risus, molestie luctus eleifend sed, malesuada eget tortor. Cras viverra lacinia libero id hendrerit. Sed urna nunc, mollis sit amet nibh ac, iaculis tempus odio. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin a metus sollicitudin dolor rhoncus euismod. Donec ullamcorper varius quam et venenatis. 
        </p>

        <div className="w-full bg-sky-950 rounded-xl p-14 h-[330px] text-white text-lg ml-10">
          <p>
          {`try {`}<br></br>
          {`let currentToken = await contractID3.methods.getCurrentTokenId().call({ from:accounts[0]})`}<br></br>
          {`return currentToken;`}<br></br>
          {`} catch (error) {`}
          <br></br>
          {`console.error(error);`}
          <br></br>
          {`} finally {`}
          <br></br>
          {`console.log('Finally');`}
          <br></br>
          {`}`}
          </p>
        </div>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        </p>

        </div>
        
        }

        { authorized && activeView === 'gettokenprice' && 

        <div className="flex flex-col w-full h-screen bg-gray-100 pl-16 pt-16 gap-6 pr-36">       
        <p className="text-2xl font-light  mt-16 py-3 ml-10 border-gray-900 border-b-[1px] hover:border-gray-600 w-[74px]">/gettokenprice</p>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        <br />
        Donec erat nibh, dictum id lacus at, feugiat rhoncus lacus. Maecenas dictum justo quis leo lobortis dictum. Fusce fermentum porta elit sed ornare. Praesent sapien risus, molestie luctus eleifend sed, malesuada eget tortor. Cras viverra lacinia libero id hendrerit. Sed urna nunc, mollis sit amet nibh ac, iaculis tempus odio. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin a metus sollicitudin dolor rhoncus euismod. Donec ullamcorper varius quam et venenatis. 
        </p>

        <div className="w-full bg-sky-950 rounded-xl p-14 h-[330px] text-white text-lg ml-10">
          <p>
          {`try {`}<br></br>
          {`let currentToken = await contractID3.methods.getCurrentTokenId().call({ from:accounts[0]})`}<br></br>
          {`return currentToken;`}<br></br>
          {`} catch (error) {`}
          <br></br>
          {`console.error(error);`}
          <br></br>
          {`} finally {`}
          <br></br>
          {`console.log('Finally');`}
          <br></br>
          {`}`}
          </p>
        </div>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        </p>

        </div>
        
        }

        { authorized && activeView === 'istudent' && 

        <div className="flex flex-col w-full h-screen bg-gray-100 pl-16 pt-16 gap-6 pr-36">       
        <p className="text-2xl font-light  mt-16 py-3 ml-10 border-gray-900 border-b-[1px] hover:border-gray-600 w-[74px]">/isstudentenrolled</p>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        <br />
        Donec erat nibh, dictum id lacus at, feugiat rhoncus lacus. Maecenas dictum justo quis leo lobortis dictum. Fusce fermentum porta elit sed ornare. Praesent sapien risus, molestie luctus eleifend sed, malesuada eget tortor. Cras viverra lacinia libero id hendrerit. Sed urna nunc, mollis sit amet nibh ac, iaculis tempus odio. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin a metus sollicitudin dolor rhoncus euismod. Donec ullamcorper varius quam et venenatis. 
        </p>

        <div className="w-full bg-sky-950 rounded-xl p-14 h-[330px] text-white text-lg ml-10">
          <p>
          {`try {`}<br></br>
          {`let currentToken = await contractID3.methods.getCurrentTokenId().call({ from:accounts[0]})`}<br></br>
          {`return currentToken;`}<br></br>
          {`} catch (error) {`}
          <br></br>
          {`console.error(error);`}
          <br></br>
          {`} finally {`}
          <br></br>
          {`console.log('Finally');`}
          <br></br>
          {`}`}
          </p>
        </div>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        </p>

        </div>
        
        }

        { authorized && activeView === 'getdiploma' && 

        <div className="flex flex-col w-full h-screen bg-gray-100 pl-16 pt-16 gap-6 pr-36">       
        <p className="text-2xl font-light  mt-16 py-3 ml-10 border-gray-900 border-b-[1px] hover:border-gray-600 w-[74px]">/getstudentdiploma</p>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        <br />
        Donec erat nibh, dictum id lacus at, feugiat rhoncus lacus. Maecenas dictum justo quis leo lobortis dictum. Fusce fermentum porta elit sed ornare. Praesent sapien risus, molestie luctus eleifend sed, malesuada eget tortor. Cras viverra lacinia libero id hendrerit. Sed urna nunc, mollis sit amet nibh ac, iaculis tempus odio. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin a metus sollicitudin dolor rhoncus euismod. Donec ullamcorper varius quam et venenatis. 
        </p>

        <div className="w-full bg-sky-950 rounded-xl p-14 h-[330px] text-white text-lg ml-10">
          <p>
          {`try {`}<br></br>
          {`let currentToken = await contractID3.methods.getCurrentTokenId().call({ from:accounts[0]})`}<br></br>
          {`return currentToken;`}<br></br>
          {`} catch (error) {`}
          <br></br>
          {`console.error(error);`}
          <br></br>
          {`} finally {`}
          <br></br>
          {`console.log('Finally');`}
          <br></br>
          {`}`}
          </p>
        </div>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        </p>
        </div>
        
        }

        { authorized && activeView === 'getbeneficiary' && 

        <div className="flex flex-col w-full h-screen bg-gray-100 pl-16 pt-16 gap-6 pr-36">       
        <p className="text-2xl font-light  mt-16 py-3 ml-10 border-gray-900 border-b-[1px] hover:border-gray-600 w-[74px]">/getbeneficiarywallet</p>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        <br />
        Donec erat nibh, dictum id lacus at, feugiat rhoncus lacus. Maecenas dictum justo quis leo lobortis dictum. Fusce fermentum porta elit sed ornare. Praesent sapien risus, molestie luctus eleifend sed, malesuada eget tortor. Cras viverra lacinia libero id hendrerit. Sed urna nunc, mollis sit amet nibh ac, iaculis tempus odio. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin a metus sollicitudin dolor rhoncus euismod. Donec ullamcorper varius quam et venenatis. 
        </p>

        <div className="w-full bg-sky-950 rounded-xl p-14 h-[330px] text-white text-lg ml-10">
          <p>
          {`try {`}<br></br>
          {`let currentToken = await contractID3.methods.getCurrentTokenId().call({ from:accounts[0]})`}<br></br>
          {`return currentToken;`}<br></br>
          {`} catch (error) {`}
          <br></br>
          {`console.error(error);`}
          <br></br>
          {`} finally {`}
          <br></br>
          {`console.log('Finally');`}
          <br></br>
          {`}`}
          </p>
        </div>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        </p>
        </div>
        
        }

        { authorized && activeView === 'settersmain' && 

        <div className="flex flex-col w-full h-screen bg-gray-100 pl-16 pt-16 gap-6 pr-36">       
        <p className="text-2xl font-light  mt-16 py-3 ml-10 border-gray-900 border-b-[1px] hover:border-gray-600 w-[74px]">Setters</p>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        <br />
        Donec erat nibh, dictum id lacus at, feugiat rhoncus lacus. Maecenas dictum justo quis leo lobortis dictum. Fusce fermentum porta elit sed ornare. Praesent sapien risus, molestie luctus eleifend sed, malesuada eget tortor. Cras viverra lacinia libero id hendrerit. Sed urna nunc, mollis sit amet nibh ac, iaculis tempus odio. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin a metus sollicitudin dolor rhoncus euismod. Donec ullamcorper varius quam et venenatis. 
        </p>

        <div className="w-full bg-sky-950 rounded-xl p-14 h-[330px] text-white text-lg ml-10">
          <p>
          {`try {`}<br></br>
          {`let currentToken = await contractID3.methods.getCurrentTokenId().call({ from:accounts[0]})`}<br></br>
          {`return currentToken;`}<br></br>
          {`} catch (error) {`}
          <br></br>
          {`console.error(error);`}
          <br></br>
          {`} finally {`}
          <br></br>
          {`console.log('Finally');`}
          <br></br>
          {`}`}
          </p>
        </div>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        </p>
        </div>
        
        }

        { authorized && activeView === 'setstudent' && 

        <div className="flex flex-col w-full h-screen bg-gray-100 pl-16 pt-16 gap-6 pr-36">       
        <p className="text-2xl font-light  mt-16 py-3 ml-10 border-gray-900 border-b-[1px] hover:border-gray-600 w-[74px]">/isstudentsetter</p>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        <br />
        Donec erat nibh, dictum id lacus at, feugiat rhoncus lacus. Maecenas dictum justo quis leo lobortis dictum. Fusce fermentum porta elit sed ornare. Praesent sapien risus, molestie luctus eleifend sed, malesuada eget tortor. Cras viverra lacinia libero id hendrerit. Sed urna nunc, mollis sit amet nibh ac, iaculis tempus odio. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin a metus sollicitudin dolor rhoncus euismod. Donec ullamcorper varius quam et venenatis. 
        </p>

        <div className="w-full bg-sky-950 rounded-xl p-14 h-[330px] text-white text-lg ml-10">
          <p>
          {`try {`}<br></br>
          {`let currentToken = await contractID3.methods.getCurrentTokenId().call({ from:accounts[0]})`}<br></br>
          {`return currentToken;`}<br></br>
          {`} catch (error) {`}
          <br></br>
          {`console.error(error);`}
          <br></br>
          {`} finally {`}
          <br></br>
          {`console.log('Finally');`}
          <br></br>
          {`}`}
          </p>
        </div>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        </p>
        </div>
        
        }

        { authorized && activeView === 'setbeneficiarywallet' && 

        <div className="flex flex-col w-full h-screen bg-gray-100 pl-16 pt-16 gap-6 pr-36">       
        <p className="text-2xl font-light  mt-16 py-3 ml-10 border-gray-900 border-b-[1px] hover:border-gray-600 w-[74px]">/setbeneficiarywallet</p>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        <br />
        Donec erat nibh, dictum id lacus at, feugiat rhoncus lacus. Maecenas dictum justo quis leo lobortis dictum. Fusce fermentum porta elit sed ornare. Praesent sapien risus, molestie luctus eleifend sed, malesuada eget tortor. Cras viverra lacinia libero id hendrerit. Sed urna nunc, mollis sit amet nibh ac, iaculis tempus odio. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin a metus sollicitudin dolor rhoncus euismod. Donec ullamcorper varius quam et venenatis. 
        </p>

        <div className="w-full bg-sky-950 rounded-xl p-14 h-[330px] text-white text-lg ml-10">
          <p>
          {`try {`}<br></br>
          {`let currentToken = await contractID3.methods.getCurrentTokenId().call({ from:accounts[0]})`}<br></br>
          {`return currentToken;`}<br></br>
          {`} catch (error) {`}
          <br></br>
          {`console.error(error);`}
          <br></br>
          {`} finally {`}
          <br></br>
          {`console.log('Finally');`}
          <br></br>
          {`}`}
          </p>
        </div>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        </p>
        </div>
        
        }

        { authorized && activeView === 'settokenprice' && 

        <div className="flex flex-col w-full h-screen bg-gray-100 pl-16 pt-16 gap-6 pr-36">       
        <p className="text-2xl font-light  mt-16 py-3 ml-10 border-gray-900 border-b-[1px] hover:border-gray-600 w-[74px]">/settokenprice</p>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        <br />
        Donec erat nibh, dictum id lacus at, feugiat rhoncus lacus. Maecenas dictum justo quis leo lobortis dictum. Fusce fermentum porta elit sed ornare. Praesent sapien risus, molestie luctus eleifend sed, malesuada eget tortor. Cras viverra lacinia libero id hendrerit. Sed urna nunc, mollis sit amet nibh ac, iaculis tempus odio. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin a metus sollicitudin dolor rhoncus euismod. Donec ullamcorper varius quam et venenatis. 
        </p>

        <div className="w-full bg-sky-950 rounded-xl p-14 h-[330px] text-white text-lg ml-10">
          <p>
          {`try {`}<br></br>
          {`let currentToken = await contractID3.methods.getCurrentTokenId().call({ from:accounts[0]})`}<br></br>
          {`return currentToken;`}<br></br>
          {`} catch (error) {`}
          <br></br>
          {`console.error(error);`}
          <br></br>
          {`} finally {`}
          <br></br>
          {`console.log('Finally');`}
          <br></br>
          {`}`}
          </p>
        </div>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        </p>

        </div>
        
        }

        { authorized && activeView === 'mintersmain' && 

        <div className="flex flex-col w-full h-screen bg-gray-100 pl-16 pt-16 gap-6 pr-36">       
        <p className="text-2xl font-light  mt-16 py-3 ml-10 border-gray-900 border-b-[1px] hover:border-gray-600 w-[74px]">Minters</p>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        <br />
        Donec erat nibh, dictum id lacus at, feugiat rhoncus lacus. Maecenas dictum justo quis leo lobortis dictum. Fusce fermentum porta elit sed ornare. Praesent sapien risus, molestie luctus eleifend sed, malesuada eget tortor. Cras viverra lacinia libero id hendrerit. Sed urna nunc, mollis sit amet nibh ac, iaculis tempus odio. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin a metus sollicitudin dolor rhoncus euismod. Donec ullamcorper varius quam et venenatis. 
        </p>

        <div className="w-full bg-sky-950 rounded-xl p-14 h-[330px] text-white text-lg ml-10">
          <p>
          {`try {`}<br></br>
          {`let currentToken = await contractID3.methods.getCurrentTokenId().call({ from:accounts[0]})`}<br></br>
          {`return currentToken;`}<br></br>
          {`} catch (error) {`}
          <br></br>
          {`console.error(error);`}
          <br></br>
          {`} finally {`}
          <br></br>
          {`console.log('Finally');`}
          <br></br>
          {`}`}
          </p>
        </div>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        </p>

        </div>
        
        }

        { authorized && activeView === 'mintdiploma' && 

        <div className="flex flex-col w-full h-screen bg-gray-100 pl-16 pt-16 gap-6 pr-36">       
        <p className="text-2xl font-light  mt-16 py-3 ml-10 border-gray-900 border-b-[1px] hover:border-gray-600 w-[74px]">/mintdiploma</p>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        <br />
        Donec erat nibh, dictum id lacus at, feugiat rhoncus lacus. Maecenas dictum justo quis leo lobortis dictum. Fusce fermentum porta elit sed ornare. Praesent sapien risus, molestie luctus eleifend sed, malesuada eget tortor. Cras viverra lacinia libero id hendrerit. Sed urna nunc, mollis sit amet nibh ac, iaculis tempus odio. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin a metus sollicitudin dolor rhoncus euismod. Donec ullamcorper varius quam et venenatis. 
        </p>

        <div className="w-full bg-sky-950 rounded-xl p-14 h-[330px] text-white text-lg ml-10">
          <p>
          {`try {`}<br></br>
          {`let currentToken = await contractID3.methods.getCurrentTokenId().call({ from:accounts[0]})`}<br></br>
          {`return currentToken;`}<br></br>
          {`} catch (error) {`}
          <br></br>
          {`console.error(error);`}
          <br></br>
          {`} finally {`}
          <br></br>
          {`console.log('Finally');`}
          <br></br>
          {`}`}
          </p>
        </div>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        </p>
        </div>
        
        }

        { authorized && activeView === 'mintdiplomawithprice' && 

        <div className="flex flex-col w-full h-screen bg-gray-100 pl-16 pt-16 gap-6 pr-36">       
        <p className="text-2xl font-light  mt-16 py-3 ml-10 border-gray-900 border-b-[1px] hover:border-gray-600 w-[74px]">/minttokenwithprice</p>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        <br />
        Donec erat nibh, dictum id lacus at, feugiat rhoncus lacus. Maecenas dictum justo quis leo lobortis dictum. Fusce fermentum porta elit sed ornare. Praesent sapien risus, molestie luctus eleifend sed, malesuada eget tortor. Cras viverra lacinia libero id hendrerit. Sed urna nunc, mollis sit amet nibh ac, iaculis tempus odio. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin a metus sollicitudin dolor rhoncus euismod. Donec ullamcorper varius quam et venenatis. 
        </p>

        <div className="w-full bg-sky-950 rounded-xl p-14 h-[330px] text-white text-lg ml-10">
          <p>
          {`try {`}<br></br>
          {`let currentToken = await contractID3.methods.getCurrentTokenId().call({ from:accounts[0]})`}<br></br>
          {`return currentToken;`}<br></br>
          {`} catch (error) {`}
          <br></br>
          {`console.error(error);`}
          <br></br>
          {`} finally {`}
          <br></br>
          {`console.log('Finally');`}
          <br></br>
          {`}`}
          </p>
        </div>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        </p>

        </div>
        
        }

        { authorized && activeView === 'mintfreetoken' && 

        <div className="flex flex-col w-full h-screen bg-gray-100 pl-16 pt-16 gap-6 pr-36">       
        <p className="text-2xl font-light  mt-16 py-3 ml-10 border-gray-900 border-b-[1px] hover:border-gray-600 w-[74px]">/mintfreetoken</p>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        <br />
        Donec erat nibh, dictum id lacus at, feugiat rhoncus lacus. Maecenas dictum justo quis leo lobortis dictum. Fusce fermentum porta elit sed ornare. Praesent sapien risus, molestie luctus eleifend sed, malesuada eget tortor. Cras viverra lacinia libero id hendrerit. Sed urna nunc, mollis sit amet nibh ac, iaculis tempus odio. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin a metus sollicitudin dolor rhoncus euismod. Donec ullamcorper varius quam et venenatis. 
        </p>

        <div className="w-full bg-sky-950 rounded-xl p-14 h-[330px] text-white text-lg ml-10">
          <p>
          {`try {`}<br></br>
          {`let currentToken = await contractID3.methods.getCurrentTokenId().call({ from:accounts[0]})`}<br></br>
          {`return currentToken;`}<br></br>
          {`} catch (error) {`}
          <br></br>
          {`console.error(error);`}
          <br></br>
          {`} finally {`}
          <br></br>
          {`console.log('Finally');`}
          <br></br>
          {`}`}
          </p>
        </div>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        </p>
        
        </div>
        
        }

        { authorized && activeView === 'editsmain' && 

        <div className="flex flex-col w-full h-screen bg-gray-100 pl-16 pt-16 gap-6 pr-36">       
        <p className="text-2xl font-light  mt-16 py-3 ml-10 border-gray-900 border-b-[1px] hover:border-gray-600 w-[74px]">Edits</p>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        <br />
        Donec erat nibh, dictum id lacus at, feugiat rhoncus lacus. Maecenas dictum justo quis leo lobortis dictum. Fusce fermentum porta elit sed ornare. Praesent sapien risus, molestie luctus eleifend sed, malesuada eget tortor. Cras viverra lacinia libero id hendrerit. Sed urna nunc, mollis sit amet nibh ac, iaculis tempus odio. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin a metus sollicitudin dolor rhoncus euismod. Donec ullamcorper varius quam et venenatis. 
        </p>

        <div className="w-full bg-sky-950 rounded-xl p-14 h-[330px] text-white text-lg ml-10">
          <p>
          {`try {`}<br></br>
          {`let currentToken = await contractID3.methods.getCurrentTokenId().call({ from:accounts[0]})`}<br></br>
          {`return currentToken;`}<br></br>
          {`} catch (error) {`}
          <br></br>
          {`console.error(error);`}
          <br></br>
          {`} finally {`}
          <br></br>
          {`console.log('Finally');`}
          <br></br>
          {`}`}
          </p>
        </div>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        </p>
        </div>
        
        }

        { authorized && activeView === 'edittokenuri' && 

        <div className="flex flex-col w-full h-screen bg-gray-100 pl-16 pt-16 gap-6 pr-36">       
        <p className="text-2xl font-light  mt-16 py-3 ml-10 border-gray-900 border-b-[1px] hover:border-gray-600 w-[74px]">/edittokenuri</p>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        <br />
        Donec erat nibh, dictum id lacus at, feugiat rhoncus lacus. Maecenas dictum justo quis leo lobortis dictum. Fusce fermentum porta elit sed ornare. Praesent sapien risus, molestie luctus eleifend sed, malesuada eget tortor. Cras viverra lacinia libero id hendrerit. Sed urna nunc, mollis sit amet nibh ac, iaculis tempus odio. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin a metus sollicitudin dolor rhoncus euismod. Donec ullamcorper varius quam et venenatis. 
        </p>

        <div className="w-full bg-sky-950 rounded-xl p-14 h-[330px] text-white text-lg ml-10">
          <p>
          {`try {`}<br></br>
          {`let currentToken = await contractID3.methods.getCurrentTokenId().call({ from:accounts[0]})`}<br></br>
          {`return currentToken;`}<br></br>
          {`} catch (error) {`}
          <br></br>
          {`console.error(error);`}
          <br></br>
          {`} finally {`}
          <br></br>
          {`console.log('Finally');`}
          <br></br>
          {`}`}
          </p>
        </div>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        </p>
        </div>
        
        }

        { authorized && activeView === 'editdiploma' && 

        <div className="flex flex-col w-full h-screen bg-gray-100 pl-16 pt-16 gap-6 pr-36">       
        <p className="text-2xl font-light  mt-16 py-3 ml-10 border-gray-900 border-b-[1px] hover:border-gray-600 w-[74px]">/editdiploma</p>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        <br />
        Donec erat nibh, dictum id lacus at, feugiat rhoncus lacus. Maecenas dictum justo quis leo lobortis dictum. Fusce fermentum porta elit sed ornare. Praesent sapien risus, molestie luctus eleifend sed, malesuada eget tortor. Cras viverra lacinia libero id hendrerit. Sed urna nunc, mollis sit amet nibh ac, iaculis tempus odio. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin a metus sollicitudin dolor rhoncus euismod. Donec ullamcorper varius quam et venenatis. 
        </p>

        <div className="w-full bg-sky-950 rounded-xl p-14 h-[330px] text-white text-lg ml-10">
          <p>
          {`try {`}<br></br>
          {`let currentToken = await contractID3.methods.getCurrentTokenId().call({ from:accounts[0]})`}<br></br>
          {`return currentToken;`}<br></br>
          {`} catch (error) {`}
          <br></br>
          {`console.error(error);`}
          <br></br>
          {`} finally {`}
          <br></br>
          {`console.log('Finally');`}
          <br></br>
          {`}`}
          </p>
        </div>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        </p>
        </div>
        
        }

        { authorized && activeView === 'utilitiesmain' && 

        <div className="flex flex-col w-full h-screen bg-gray-100 pl-16 pt-16 gap-6 pr-36">       
        <p className="text-2xl font-light  mt-16 py-3 ml-10 border-gray-900 border-b-[1px] hover:border-gray-600 w-[74px]">Utilities</p>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        <br />
        Donec erat nibh, dictum id lacus at, feugiat rhoncus lacus. Maecenas dictum justo quis leo lobortis dictum. Fusce fermentum porta elit sed ornare. Praesent sapien risus, molestie luctus eleifend sed, malesuada eget tortor. Cras viverra lacinia libero id hendrerit. Sed urna nunc, mollis sit amet nibh ac, iaculis tempus odio. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin a metus sollicitudin dolor rhoncus euismod. Donec ullamcorper varius quam et venenatis. 
        </p>

        <div className="w-full bg-sky-950 rounded-xl p-14 h-[330px] text-white text-lg ml-10">
          <p>
          {`try {`}<br></br>
          {`let currentToken = await contractID3.methods.getCurrentTokenId().call({ from:accounts[0]})`}<br></br>
          {`return currentToken;`}<br></br>
          {`} catch (error) {`}
          <br></br>
          {`console.error(error);`}
          <br></br>
          {`} finally {`}
          <br></br>
          {`console.log('Finally');`}
          <br></br>
          {`}`}
          </p>
        </div>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        </p>
        </div>
        
        }

        { authorized && activeView === 'walletbalance' && 

        <div className="flex flex-col w-full h-screen bg-gray-100 pl-16 pt-16 gap-6 pr-36">       
        <p className="text-2xl font-light  mt-16 py-3 ml-10 border-gray-900 border-b-[1px] hover:border-gray-600 w-[74px]">/getwalletbalance</p>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        <br />
        Donec erat nibh, dictum id lacus at, feugiat rhoncus lacus. Maecenas dictum justo quis leo lobortis dictum. Fusce fermentum porta elit sed ornare. Praesent sapien risus, molestie luctus eleifend sed, malesuada eget tortor. Cras viverra lacinia libero id hendrerit. Sed urna nunc, mollis sit amet nibh ac, iaculis tempus odio. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin a metus sollicitudin dolor rhoncus euismod. Donec ullamcorper varius quam et venenatis. 
        </p>

        <div className="w-full bg-sky-950 rounded-xl p-14 h-[330px] text-white text-lg ml-10">
          <p>
          {`try {`}<br></br>
          {`let currentToken = await contractID3.methods.getCurrentTokenId().call({ from:accounts[0]})`}<br></br>
          {`return currentToken;`}<br></br>
          {`} catch (error) {`}
          <br></br>
          {`console.error(error);`}
          <br></br>
          {`} finally {`}
          <br></br>
          {`console.log('Finally');`}
          <br></br>
          {`}`}
          </p>
        </div>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        </p>
        </div>
        
        }

        { authorized && activeView === 'walletaddress' && 

        <div className="flex flex-col w-full h-screen bg-gray-100 pl-16 pt-16 gap-6 pr-36">       
        <p className="text-2xl font-light  mt-16 py-3 ml-10 border-gray-900 border-b-[1px] hover:border-gray-600 w-[74px]">/getwalletaddress</p>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        <br />
        Donec erat nibh, dictum id lacus at, feugiat rhoncus lacus. Maecenas dictum justo quis leo lobortis dictum. Fusce fermentum porta elit sed ornare. Praesent sapien risus, molestie luctus eleifend sed, malesuada eget tortor. Cras viverra lacinia libero id hendrerit. Sed urna nunc, mollis sit amet nibh ac, iaculis tempus odio. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin a metus sollicitudin dolor rhoncus euismod. Donec ullamcorper varius quam et venenatis. 
        </p>

        <div className="w-full bg-sky-950 rounded-xl p-14 h-[330px] text-white text-lg ml-10">
          <p>
          {`try {`}<br></br>
          {`let currentToken = await contractID3.methods.getCurrentTokenId().call({ from:accounts[0]})`}<br></br>
          {`return currentToken;`}<br></br>
          {`} catch (error) {`}
          <br></br>
          {`console.error(error);`}
          <br></br>
          {`} finally {`}
          <br></br>
          {`console.log('Finally');`}
          <br></br>
          {`}`}
          </p>
        </div>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        </p>
        </div>
        
        }

        { authorized && activeView === 'pullfunds' && 

        <div className="flex flex-col w-full h-screen bg-gray-100 pl-16 pt-16 gap-6 pr-36">       
        <p className="text-2xl font-light  mt-16 py-3 ml-10 border-gray-900 border-b-[1px] hover:border-gray-600 w-[74px]">/pullfundsfromcontract</p>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        <br />
        Donec erat nibh, dictum id lacus at, feugiat rhoncus lacus. Maecenas dictum justo quis leo lobortis dictum. Fusce fermentum porta elit sed ornare. Praesent sapien risus, molestie luctus eleifend sed, malesuada eget tortor. Cras viverra lacinia libero id hendrerit. Sed urna nunc, mollis sit amet nibh ac, iaculis tempus odio. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin a metus sollicitudin dolor rhoncus euismod. Donec ullamcorper varius quam et venenatis. 
        </p>

        <div className="w-full bg-sky-950 rounded-xl p-14 h-[330px] text-white text-lg ml-10">
          <p>
          {`try {`}<br></br>
          {`let currentToken = await contractID3.methods.getCurrentTokenId().call({ from:accounts[0]})`}<br></br>
          {`return currentToken;`}<br></br>
          {`} catch (error) {`}
          <br></br>
          {`console.error(error);`}
          <br></br>
          {`} finally {`}
          <br></br>
          {`console.log('Finally');`}
          <br></br>
          {`}`}
          </p>
        </div>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        </p>
        </div>
        
        }

        { authorized && activeView === 'validatetoken' && 

        <div className="flex flex-col w-full h-screen bg-gray-100 pl-16 pt-16 gap-6 pr-36">       
        <p className="text-2xl font-light  mt-16 py-3 ml-10 border-gray-900 border-b-[1px] hover:border-gray-600 w-[74px]">/validatetoken</p>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        <br />
        Donec erat nibh, dictum id lacus at, feugiat rhoncus lacus. Maecenas dictum justo quis leo lobortis dictum. Fusce fermentum porta elit sed ornare. Praesent sapien risus, molestie luctus eleifend sed, malesuada eget tortor. Cras viverra lacinia libero id hendrerit. Sed urna nunc, mollis sit amet nibh ac, iaculis tempus odio. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin a metus sollicitudin dolor rhoncus euismod. Donec ullamcorper varius quam et venenatis. 
        </p>

        <div className="w-full bg-sky-950 rounded-xl p-14 h-[330px] text-white text-lg ml-10">
          <p>
          {`try {`}<br></br>
          {`let currentToken = await contractID3.methods.getCurrentTokenId().call({ from:accounts[0]})`}<br></br>
          {`return currentToken;`}<br></br>
          {`} catch (error) {`}
          <br></br>
          {`console.error(error);`}
          <br></br>
          {`} finally {`}
          <br></br>
          {`console.log('Finally');`}
          <br></br>
          {`}`}
          </p>
        </div>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        </p>
        </div>
        
        }

        { authorized && activeView === 'deletemain' && 

        <div className="flex flex-col w-full h-screen bg-gray-100 pl-16 pt-16 gap-6 pr-36">       
        <p className="text-2xl font-light  mt-16 py-3 ml-10 border-gray-900 border-b-[1px] hover:border-gray-600 w-[74px]">Delete</p>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        <br />
        Donec erat nibh, dictum id lacus at, feugiat rhoncus lacus. Maecenas dictum justo quis leo lobortis dictum. Fusce fermentum porta elit sed ornare. Praesent sapien risus, molestie luctus eleifend sed, malesuada eget tortor. Cras viverra lacinia libero id hendrerit. Sed urna nunc, mollis sit amet nibh ac, iaculis tempus odio. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin a metus sollicitudin dolor rhoncus euismod. Donec ullamcorper varius quam et venenatis. 
        </p>

        <div className="w-full bg-sky-950 rounded-xl p-14 h-[330px] text-white text-lg ml-10">
          <p>
          {`try {`}<br></br>
          {`let currentToken = await contractID3.methods.getCurrentTokenId().call({ from:accounts[0]})`}<br></br>
          {`return currentToken;`}<br></br>
          {`} catch (error) {`}
          <br></br>
          {`console.error(error);`}
          <br></br>
          {`} finally {`}
          <br></br>
          {`console.log('Finally');`}
          <br></br>
          {`}`}
          </p>
        </div>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        </p>
        </div>
        
        }

        { authorized && activeView === 'deletetoken' && 

        <div className="flex flex-col w-full h-screen bg-gray-100 pl-16 pt-16 gap-6 pr-36">       
        <p className="text-2xl font-light  mt-16 py-3 ml-10 border-gray-900 border-b-[1px] hover:border-gray-600 w-[74px]">/deletetoken</p>
        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        <br />
        Donec erat nibh, dictum id lacus at, feugiat rhoncus lacus. Maecenas dictum justo quis leo lobortis dictum. Fusce fermentum porta elit sed ornare. Praesent sapien risus, molestie luctus eleifend sed, malesuada eget tortor. Cras viverra lacinia libero id hendrerit. Sed urna nunc, mollis sit amet nibh ac, iaculis tempus odio. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin a metus sollicitudin dolor rhoncus euismod. Donec ullamcorper varius quam et venenatis. 
        </p>

        <div className="w-full bg-sky-950 rounded-xl p-14 h-[330px] text-white text-lg ml-10">
          <p>
          {`try {`}<br></br>
          {`let currentToken = await contractID3.methods.getCurrentTokenId().call({ from:accounts[0]})`}<br></br>
          {`return currentToken;`}<br></br>
          {`} catch (error) {`}
          <br></br>
          {`console.error(error);`}
          <br></br>
          {`} finally {`}
          <br></br>
          {`console.log('Finally');`}
          <br></br>
          {`}`}
          </p>
        </div>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        </p>
        </div>
        
        }

        { authorized && activeView === 'deletediploma' && 

        <div className="flex flex-col w-full h-screen bg-gray-100 pl-16 pt-16 gap-6 pr-36">       
        <p className="text-2xl font-light  mt-16 py-3 ml-10 border-gray-900 border-b-[1px] hover:border-gray-600 w-[74px]">/deletediploma</p>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        <br />
        Donec erat nibh, dictum id lacus at, feugiat rhoncus lacus. Maecenas dictum justo quis leo lobortis dictum. Fusce fermentum porta elit sed ornare. Praesent sapien risus, molestie luctus eleifend sed, malesuada eget tortor. Cras viverra lacinia libero id hendrerit. Sed urna nunc, mollis sit amet nibh ac, iaculis tempus odio. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin a metus sollicitudin dolor rhoncus euismod. Donec ullamcorper varius quam et venenatis. 
        </p>

        <div className="w-full bg-sky-950 rounded-xl p-14 h-[330px] text-white text-lg ml-10">
          <p>
          {`try {`}<br></br>
          {`let currentToken = await contractID3.methods.getCurrentTokenId().call({ from:accounts[0]})`}<br></br>
          {`return currentToken;`}<br></br>
          {`} catch (error) {`}
          <br></br>
          {`console.error(error);`}
          <br></br>
          {`} finally {`}
          <br></br>
          {`console.log('Finally');`}
          <br></br>
          {`}`}
          </p>
        </div>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        </p>
        </div>
        
        }

        { authorized && activeView === 'deletestudent' && 

        <div className="flex flex-col w-full h-screen bg-gray-100 pl-16 pt-16 gap-6 pr-36">       
        <p className="text-2xl font-light  mt-16 py-3 ml-10 border-gray-900 border-b-[1px] hover:border-gray-600 w-[74px]">/deletestudentenrolled</p>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        <br />
        Donec erat nibh, dictum id lacus at, feugiat rhoncus lacus. Maecenas dictum justo quis leo lobortis dictum. Fusce fermentum porta elit sed ornare. Praesent sapien risus, molestie luctus eleifend sed, malesuada eget tortor. Cras viverra lacinia libero id hendrerit. Sed urna nunc, mollis sit amet nibh ac, iaculis tempus odio. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin a metus sollicitudin dolor rhoncus euismod. Donec ullamcorper varius quam et venenatis. 
        </p>

        <div className="w-full bg-sky-950 rounded-xl p-14 h-[330px] text-white text-lg ml-10">
          <p>
          {`try {`}<br></br>
          {`let currentToken = await contractID3.methods.getCurrentTokenId().call({ from:accounts[0]})`}<br></br>
          {`return currentToken;`}<br></br>
          {`} catch (error) {`}
          <br></br>
          {`console.error(error);`}
          <br></br>
          {`} finally {`}
          <br></br>
          {`console.log('Finally');`}
          <br></br>
          {`}`}
          </p>
        </div>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        </p>
        </div>
        
        }

        { authorized && activeView === 'pauseunpausemain' && 

        <div className="flex flex-col w-full h-screen bg-gray-100 pl-16 pt-16 gap-6 pr-36">       
        <p className="text-2xl font-light  mt-16 py-3 ml-10 border-gray-900 border-b-[1px] hover:border-gray-600 w-[74px]">Pause / Unpause</p>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        <br />
        Donec erat nibh, dictum id lacus at, feugiat rhoncus lacus. Maecenas dictum justo quis leo lobortis dictum. Fusce fermentum porta elit sed ornare. Praesent sapien risus, molestie luctus eleifend sed, malesuada eget tortor. Cras viverra lacinia libero id hendrerit. Sed urna nunc, mollis sit amet nibh ac, iaculis tempus odio. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin a metus sollicitudin dolor rhoncus euismod. Donec ullamcorper varius quam et venenatis. 
        </p>

        <div className="w-full bg-sky-950 rounded-xl p-14 h-[330px] text-white text-lg ml-10">
          <p>
          {`try {`}<br></br>
          {`let currentToken = await contractID3.methods.getCurrentTokenId().call({ from:accounts[0]})`}<br></br>
          {`return currentToken;`}<br></br>
          {`} catch (error) {`}
          <br></br>
          {`console.error(error);`}
          <br></br>
          {`} finally {`}
          <br></br>
          {`console.log('Finally');`}
          <br></br>
          {`}`}
          </p>
        </div>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        </p>
        </div>
        
        }

        { authorized && activeView === 'pausecontract' && 

        <div className="flex flex-col w-full h-screen bg-gray-100 pl-16 pt-16 gap-6 pr-36">       
        <p className="text-2xl font-light  mt-16 py-3 ml-10 border-gray-900 border-b-[1px] hover:border-gray-600 w-[74px]">/pausecontract</p>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        <br />
        Donec erat nibh, dictum id lacus at, feugiat rhoncus lacus. Maecenas dictum justo quis leo lobortis dictum. Fusce fermentum porta elit sed ornare. Praesent sapien risus, molestie luctus eleifend sed, malesuada eget tortor. Cras viverra lacinia libero id hendrerit. Sed urna nunc, mollis sit amet nibh ac, iaculis tempus odio. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin a metus sollicitudin dolor rhoncus euismod. Donec ullamcorper varius quam et venenatis. 
        </p>

        <div className="w-full bg-sky-950 rounded-xl p-14 h-[330px] text-white text-lg ml-10">
          <p>
          {`try {`}<br></br>
          {`let currentToken = await contractID3.methods.getCurrentTokenId().call({ from:accounts[0]})`}<br></br>
          {`return currentToken;`}<br></br>
          {`} catch (error) {`}
          <br></br>
          {`console.error(error);`}
          <br></br>
          {`} finally {`}
          <br></br>
          {`console.log('Finally');`}
          <br></br>
          {`}`}
          </p>
        </div>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        </p>
        </div>
        
        }

        { authorized && activeView === 'unpausecontract' && 

        <div className="flex flex-col w-full h-screen bg-gray-100 pl-16 pt-16 gap-6 pr-36">       
        <p className="text-2xl font-light  mt-16 py-3 ml-10 border-gray-900 border-b-[1px] hover:border-gray-600 w-[74px]">/unpausecontract</p>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        <br />
        Donec erat nibh, dictum id lacus at, feugiat rhoncus lacus. Maecenas dictum justo quis leo lobortis dictum. Fusce fermentum porta elit sed ornare. Praesent sapien risus, molestie luctus eleifend sed, malesuada eget tortor. Cras viverra lacinia libero id hendrerit. Sed urna nunc, mollis sit amet nibh ac, iaculis tempus odio. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin a metus sollicitudin dolor rhoncus euismod. Donec ullamcorper varius quam et venenatis. 
        </p>

        <div className="w-full bg-sky-950 rounded-xl p-14 h-[330px] text-white text-lg ml-10">
          <p>
          {`try {`}<br></br>
          {`let currentToken = await contractID3.methods.getCurrentTokenId().call({ from:accounts[0]})`}<br></br>
          {`return currentToken;`}<br></br>
          {`} catch (error) {`}
          <br></br>
          {`console.error(error);`}
          <br></br>
          {`} finally {`}
          <br></br>
          {`console.log('Finally');`}
          <br></br>
          {`}`}
          </p>
        </div>

        <p className="ml-10">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas convallis eros dolor, at tristique lacus pellentesque ut. Fusce dolor ligula, euismod at ante id, congue maximus nisi. Vivamus scelerisque ex leo. Ut metus erat, volutpat at felis sit amet, posuere bibendum ex. Nam ut egestas nisi. Ut facilisis eros lectus, in ornare arcu porttitor non. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec tortor est, dictum nec auctor id, commodo a lorem. Nunc sed tempor felis. Suspendisse potenti. Fusce sit amet pharetra tellus. Proin ultrices malesuada fermentum. Aliquam ante est, ultricies eget nisi quis, hendrerit imperdiet metus. Curabitur porttitor at lacus ultrices tempor. Vivamus pulvinar fermentum leo non gravida.
        </p>
        </div>
        
        }

        { activeView === 'adminlogin' &&
        
        <div className="w-full">

        {error && <Alert message={error} />}

        {
         user && user.email ? 

         <div className="flex flex-col w-full h-screen bg-gray-100 p-16 items-center justify-center gap-6">
         <h1 className="text-4xl font-semibold pt-16 pl-10 uppercase text-center w-full">
         ¡Bienvenido/a {user.displayName}!
          </h1>
         <h1 className="text-3xl font-light text-center w-full">
           Utiliza el submenú  de Smart Contract para interactuar con el.
        </h1>
        </div>

         :
        
        <div className="flex flex-col w-full h-screen bg-gray-100 p-16 gap-6 justify-center">

        <div className="w-4/12 justify-center align-center mx-auto border-gray-900 border-[1px] rounded-xl px-4">

        <p className="text-2xl font-light mt-16 py-3 border-gray-900 border-b-[1px]  hover:border-gray-600  w-3/4 text-center mx-auto">Admin Dashboard</p>

        <form
        onSubmit={handleSubmit}
        className="rounded sm:pt-8 md:pt-6 pb-8 mb-4 w-3/4 mx-auto"
        >
        <h1 className="text-center font-helveticaL sm:text-2xl md:text-4xl tracking-widest" >BIENVENIDO/A</h1>
        <div className="sm:pt-8 md:pt-8 mb-8">
          <label
            htmlFor="email"
            className="block text-base font-semibold mb-2 font-helveticaL"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            
            className="bg-transparent  rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline border-gray-900 border-[1px]"          
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-base font-semibold mb-2 font-helveticaL"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            
            className="bg-transparent  rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-900 border-[1px]"
          />
        </div>

        <div className="flex items-center justify-between sm:pt-3 md:pt-0">
          <button
            className="hover:text-gray-500 font-bold rounded focus:outline-none focus:shadow-outline font-helveticaL text-sm"
            type="submit"
          >
            Sign In
          </button>
          <a
            className="inline-block align-baseline font-bold text-sm font-helveticaL hover:text-gray-500"
            href="#!"
            onClick={handleResetPassword}
          >
            Forgot Password?
          </a>
        </div>

        <button
        onClick={handleGoogleSignin}
        className="border border-[black] rounded hover:bg-[#D68500] hover:text-white text-black text-black shadow rounded bg-transparent border border-white mt-8 py-2 px-4 w-full"
      >
        Google
      </button> 

      <hr className="bg-grey my-8 h-px bg-white border-0 dark:bg-[#40E0D0"/>


        </form>

        
        
        </div>

        </div>
        }
        </div>
       
        }

        { adminView && activeView === 'stats' && 

          <div className="flex flex-col w-full h-screen bg-gray-100 p-16 gap-6">       
          <p className="text-2xl font-light  mt-16 py-3 ml-10 border-gray-900 border-b-[1px] hover:border-gray-600 w-[74px]">Stats</p>
          </div>

        }

        { adminView && activeView === 'create' && 
          
          <div className="flex flex-col w-full h-screen bg-gray-100 p-16 gap-6">  
          
          <p className="text-2xl font-light  mt-16 py-3 ml-10 border-gray-900 border-b-[1px] hover:border-gray-600 w-[74px]">Create</p>
          
          </div>
        }

        { adminView && activeView === 'edit' && 
         <div className="flex flex-col w-full h-screen bg-gray-100 p-16 gap-6"> 
          
          <p className="text-2xl font-light  mt-16 py-3 ml-10 border-gray-900 border-b-[1px] hover:border-gray-600 w-[74px]">Edit</p>

          </div>      
        }

        { adminView && activeView === 'delete' && 
          <div className="flex flex-col w-full h-screen bg-gray-100 p-16 gap-6"> 

              <p className="text-2xl font-light  mt-16 py-3 ml-10 border-gray-900 border-b-[1px] hover:border-gray-600 w-[74px]">Delete</p>
          
          </div>        
        }

        { adminView && activeView === 'withdraw' && 
          <div className="flex flex-col w-full h-screen bg-gray-100 p-16 gap-6">   
              <p className="text-2xl font-light  mt-16 py-3 ml-10 border-gray-900 border-b-[1px] hover:border-gray-600 w-[74px]">Withdraw</p>
          </div>     
        }

        { adminView && activeView === 'validate' && 
           <div className="flex flex-col w-full h-screen bg-gray-100 p-16 gap-6">    
              <p className="text-2xl font-light  mt-16 py-3 ml-10 border-gray-900 border-b-[1px] hover:border-gray-600 w-[74px]">Validate</p>
           </div>    
        }

        { adminView && activeView === 'settings' && 
            <div className="flex flex-col w-full h-screen bg-gray-100 p-16 gap-6">      
              <p className="text-2xl font-light  mt-16 py-3 ml-10 border-gray-900 border-b-[1px] hover:border-gray-600 w-[74px]">Settings</p>
              </div>     
        }

          
      </main>
    </div>
  );
}

export default App;
