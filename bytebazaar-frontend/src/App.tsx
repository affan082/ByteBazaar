import { useContext } from "react";
import { ConfigContext } from "./reducers/GlobalConfig.tsx";
import AuthProvider from "./reducers/AuthProvider.tsx";
import { ProductConfigContext } from "./reducers/ProductConfig.tsx";
import RouterSelector from "./reducers/RouterSelector.tsx";

function App() {
  const config = useContext(ConfigContext);
  const productConfig = useContext(ProductConfigContext);

  return (
    <ConfigContext.Provider value={config}>
      <ProductConfigContext.Provider value={productConfig}>
        <AuthProvider>
          <RouterSelector />
        </AuthProvider>
      </ProductConfigContext.Provider>
    </ConfigContext.Provider>
  );
}

export default App;
