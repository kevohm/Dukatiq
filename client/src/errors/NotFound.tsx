import { Link } from '@tanstack/react-router'
import { Button } from '../components/ui/Button'

const NotFound = () => {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="h-96 flex flex-col items-center justify-center w-full max-w-md rounded-2xl shadow-sm border border-border">
                <h1 className="text-xl font-bold">Oops! Page does not exist</h1>
                <div className="flex justify-between gap-8 items-center mt-8">
                    <Link to="/">
                        <Button variant="primary">Go Home</Button>
                    </Link>
                    <Link to="..">
                        <Button variant="secondary">Go Back</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default NotFound
