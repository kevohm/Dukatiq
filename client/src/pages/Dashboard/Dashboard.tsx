import { Topbar } from '../../components/layout/Topbar'
import StatsSection from './components/StatsSection'

const Dashboard = () => {
    return (
        <div className="flex flex-col gap-5 h-screen">
            <Topbar title={'Dashboard'} subTitle={new Date().toDateString()} />
            <div className="px-6">
                <StatsSection />
            </div>
        </div>
    )
}

export default Dashboard
