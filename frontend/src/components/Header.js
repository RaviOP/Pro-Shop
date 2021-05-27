import React from "react";
import { useHistory, Route } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { NavDropdown, Navbar, Nav, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/userActions";
import SearchBox from "./SearchBox";

const Header = ({ location }) => {
	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;
	const dispatch = useDispatch();
	const history = useHistory();

	const logoutHandler = () => {
		dispatch(logout());
		history.push("/login");
	};

	return (
		<header>
			<Navbar bg='dark' variant='dark' expand='md' collapseOnSelect>
				<Container>
					<LinkContainer exact to='/'>
						<Navbar.Brand>ProShop</Navbar.Brand>
					</LinkContainer>
					<Navbar.Toggle aria-controls='basic-navbar-nav' />
					<Navbar.Collapse id='basic-navbar-nav'>
						<Route render={({ history }) => <SearchBox history={history} />} />
						<Nav className='text-center'>
							<LinkContainer exact to='/'>
								<Nav.Link>
									<i className='fas fa-home p-1'></i>Home
								</Nav.Link>
							</LinkContainer>
							<LinkContainer to='/cart'>
								<Nav.Link>
									<i className='fas fa-shopping-cart p-1'></i>Cart
								</Nav.Link>
							</LinkContainer>
							{userInfo && !userInfo.isAdmin && (
								<>
									<Nav.Link onClick={logoutHandler}>
										<i className='fas fa-sign-out-alt p-1'></i>
										Logout
									</Nav.Link>
									<LinkContainer to='/profile'>
										<Nav.Link>
											<i className='fas fa-user p-1'></i>
											{userInfo.name}
										</Nav.Link>
									</LinkContainer>
									{/* <NavDropdown title={userInfo.name} id='username'>
										<LinkContainer to='/profile'>
											<NavDropdown.Item>Profile</NavDropdown.Item>
										</LinkContainer>
										<NavDropdown.Item onClick={logoutHandler}>
											Logout
										</NavDropdown.Item>
									</NavDropdown> */}
								</>
							)}
							{!userInfo && (
								<>
									<LinkContainer to='/login'>
										<Nav.Link>
											<i className='fas fa-user p-1'></i>Login
										</Nav.Link>
									</LinkContainer>
									<LinkContainer to='/register'>
										<Nav.Link>
											<i className='fas fa-user-plus p-1'></i>Register
										</Nav.Link>
									</LinkContainer>
								</>
							)}
							{userInfo && userInfo.isAdmin && (
								<NavDropdown title={userInfo.name} id='adminMenu'>
									<LinkContainer to='/profile'>
										<NavDropdown.Item>Profile</NavDropdown.Item>
									</LinkContainer>
									<LinkContainer to='/admin/userlist'>
										<NavDropdown.Item>Users</NavDropdown.Item>
									</LinkContainer>
									<LinkContainer to='/admin/productlist'>
										<NavDropdown.Item>Products</NavDropdown.Item>
									</LinkContainer>
									<LinkContainer to='/admin/orderlist'>
										<NavDropdown.Item>Orders</NavDropdown.Item>
									</LinkContainer>
									<NavDropdown.Item onClick={logoutHandler}>
										Logout
									</NavDropdown.Item>
								</NavDropdown>
							)}
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</header>
	);
};

export default Header;
