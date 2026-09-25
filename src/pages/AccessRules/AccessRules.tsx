import type {AccessRule} from "../../api/types.ts";
import {useEffect, useState} from "react";
import {getAccessRules} from "../../api/authelia/access-rules.ts";

const AccessRules = () => {
    const [accessRules, setAccessRules] = useState<AccessRule[]>([]);

    const fetchAccessRules = () => {
        getAccessRules().then((data) => {
            setAccessRules(data);
        });
    };

    useEffect(() => {
        fetchAccessRules();
    }, []);

    return (
        <div className={'flex flex-col gap-4'}>
            <div className={'flex flex-col gap-2 justify-center items-start'}>
                <h1 className={'text-4xl font-semibold'}>Règles d'accès</h1>
                <p className={'text-gray-500'}>Définissez quelle politique d'authentification s'applique à quel groupe sur quel site.</p>
            </div>
            <div className={'flex flex-col border border-gray-200 rounded-2xl shadow-md'}>
                {
                    accessRules.map((rule, index) => (
                        <div key={index} className={'flex flex-col gap-3 not-last:border-b not-last:border-gray-200 p-4'}>
                            <div className={'flex flex-col gap-px'}>
                                <p className={'font-semibold'}>Rule {index + 1}</p>
                                <p className={'text-gray-500'}>Domain: {rule.domain}</p>
                                <p className={'text-gray-500'}>Policy: {rule.policy}</p>
                            </div>
                            <div className={'flex gap-1'}>
                                    <span className={'py-1 px-2 border border-gray-200 rounded-lg text-xs'}>{rule.subject}</span>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default AccessRules;