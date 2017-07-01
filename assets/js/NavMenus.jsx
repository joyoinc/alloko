
class NavMenuItem extends React.Component {
    render(props) {
        return <li className={this.props.className} ><a href="">{this.props.text}</a></li>
    }
}

class NavMenus extends React.Component {
    render() {
        return <ul className="nav navbar-nav navbar-right">
            <NavMenuItem text="加盟" className="active" />
            <NavMenuItem text="注册" className=" " />
            <NavMenuItem text="登录" className=" " />
        </ul>
    }
}

//export default new NavMenus();
window.NavMenus = NavMenus;