/* eslint-disable react/prop-types */
import WifiOffIcon from '@mui/icons-material/WifiOff';
import { Offline } from 'react-detect-offline';

const CheckConnection = ({ children }) => {

    return (
        <>
                { children }
                <Offline>
                    <div className="font-bold absolute flex justify-center items-center gap-2.5 top-3 right-3 rounded-sm border" style={{ padding:"10px", backdropFilter:"blur(1000px)"}}>
                        <WifiOffIcon fontSize="large" />
                        <span>Please Check Your Internet Connection</span>
                    </div>
                </Offline>
            </>
        )

};

export default CheckConnection;
