import {useEffect, useState} from "react";
import {getUsers} from "../../api/authelia/users.ts";
import type {AccessRule, AutheliaUser} from "../../api/types.ts";
import {DashboardCard} from "./components/DashboardCard.tsx";
import {IconShieldCheck, IconUsers} from "@tabler/icons-react";
import {getAccessRules} from "../../api/authelia/access-rules.ts";

function Landing() {

  const [users, setUsers] = useState<AutheliaUser[]>([]);
  const [accessRules, setAccessRules] = useState<AccessRule[]>([]);

  useEffect(() => {
    getUsers().then((data) => {
      setUsers(data)
    });

    getAccessRules().then((data) => {
      setAccessRules(data)
    });
  }, [])

  return (
    <div className={'flex flex-col gap-4'}>
      <header className={'flex flex-col gap-2 justify-center items-start'}>
        <h1 className={'text-4xl font-semibold'}>Tableau de bord</h1>
        <p className={'text-gray-500'}>Vue d'ensemble de votre configuration Authelia</p>
      </header>
      <section className={'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2'}>
        <DashboardCard title={'Utilisateurs'} count={users.length} icon={<IconUsers size={32} />} />
        <DashboardCard title={'Règles d\'accès'} count={accessRules.length} icon={<IconShieldCheck size={32} />} />
      </section>
    </div>
  )
}

export default Landing
