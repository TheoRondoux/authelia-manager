import {IconLoader2} from "@tabler/icons-react";
import React from "react";

interface LoaderProps {
    size?: number;
}

const Loader: React.FC<LoaderProps> = ({size = 24}) => {
    return (
        <div className={'animate-spin align-middle'}>
            <IconLoader2 size={size}/>
        </div>
    )
};

export default Loader;