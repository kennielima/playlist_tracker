import HeaderComponent from './components/HeaderComponent';
import fetchCurrentUser from '../hooks/getMe';

const Header = async () => {
    const user = await fetchCurrentUser();
    return (
        <HeaderComponent user={user} />
    )
}

export default Header