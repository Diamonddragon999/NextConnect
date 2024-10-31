import React, { useState } from "react";
import Link from "next/link";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdCancel } from "react-icons/md";
import { BsGithub, BsTwitter } from "react-icons/bs";
import Image from "next/image";

const Nav = () => {
	const [hamburger, setHamburger] = useState(false);
	return (
		<div className='h-[10vh] flex items-center justify-between px-[20px] sticky top-0 bg-white'>
			<Link href='/'>
				<h1 className='text-xl font-bold text-black'>
					<Image
						src='/images/logo.png' // Replace with your image path
						alt='Logo'
						width={80} // Set the width according to your needs
						height={80} // Set the height according to your needs
						className='mr-2 ml-2' // Add margin or any other class for styling
        			  />
				</h1>
			</Link>
			<div className='md:flex items-center justify-between hidden space-x-8'>
				<Link legacyBehavior href='/dashboard' className=' text-gray-400 hover:text-white'>
				    <a className='px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300'>
						Dashboard
					</a>
				</Link>
			</div>
			<div className='md:hidden block'>
				<GiHamburgerMenu
					className='cursor-pointer text-2xl text-gray-400'
					onClick={() => setHamburger(true)}
				/>
			</div>
			{hamburger && (
				<nav className='fixed top-0 right-0 w-1/2 dim h-[100vh] p-6'>
					<div className='w-full flex items-center justify-end mb-8'>
						<MdCancel
							className='text-4xl text-blue-600 cursor-pointer hover:text-white'
							onClick={() => setHamburger(false)}
						/>
					</div>
					<div className='flex w-full flex-col space-y-8'>
						<Link href='/dashboard' className='text-white hover:text-blue-100'>
							Dashboard
						</Link>
					</div>
				</nav>
			)}
		</div>
	);
};

export default Nav;