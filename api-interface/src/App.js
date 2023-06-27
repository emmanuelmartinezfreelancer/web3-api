import Sidebar from './components/Sidebar';
import { useState, useEffect  } from "react";


function App() {

  const [activeView, setActiveView] = useState('dashboard');
  const [ jsonPassword, setjsonPassword ] = useState('');
  const [ authorized, setAuthorized ] = useState(false);

  const password = "123456";

  useEffect(() => {
    console.log("Autorizada", authorized);
  }, [authorized, activeView]);

  const parseJson = (content) => {
    try {
      const data = JSON.parse(content);
      const passwordJSON = data.password;

      if(passwordJSON === password) {

        setjsonPassword(passwordJSON);
        setAuthorized(true);
        setActiveView("introduccion")

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

          <Sidebar authorized = {authorized} activeview= { activeView } setActiveView = { setActiveView } />

          { 

          activeView === 'dashboard' && 

          <div className="flex flex-col w-full h-screen bg-gray-100 p-16 items-center justify-center gap-6">
            <h1 className="text-4xl font-semibold pt-16 pl-10 uppercase">
              ¡Bienvenido al mundo de la Web 3.0!
            </h1>
            <h1 className="text-2xl font-light text-center">
                Con esta API puedes gestionar el Smart Contract de ID3, <br />por favor abre el JSON con el password para desbloquear la interfaz.
            </h1>
            <div className="w-1/2 flex justify-center border-gray-900 border-[1px] hover:border-gray-600 rounded-xl py-3">
                <input
                className="py-2 px-4 text-black rounded-md font-semibold transition-colors duration-300"
                type="file"
                onChange={ handleFileChange }
                />
            </div>
         </div>

        }

        { 

        activeView === 'introduccion' &&
          <div className="flex flex-col w-full h-screen bg-gray-100 p-16 gap-6">

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

        <div className="flex flex-col w-full h-screen bg-gray-100 p-16 gap-6">
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

        <div className="flex flex-col w-full h-screen bg-gray-100 p-16 gap-6">
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

        <div className="flex flex-col w-full h-screen bg-gray-100 p-16 gap-6">
        <p className="text-2xl font-light pl-3 mt-16 py-3 ml-10 border-gray-900 border-[1px] hover:border-gray-600 rounded-xl w-[300px] ">¿Cómo funciona esta API?</p>
        <p className="pl-10 text-xl">
          Funciona shingón
        </p>
        </div>

        }

      </main>
    </div>
  );
}

export default App;
