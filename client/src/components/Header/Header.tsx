import HeaderComponent from './HeaderComponent';
import fetchCurrentUser from '../../services/getMe';

const Header = async () => {
    const user = await fetchCurrentUser();
    return (
        <HeaderComponent user={user} />
    )
}

export default Header