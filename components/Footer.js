import React from "react";
import { BsFacebook, BsInstagram, BsTwitter, BsLinkedin } from "react-icons/bs";
import Link from "next/link";

const Footer = () => {
	return (
		<footer className='w-full bg-blue-50 text-gray-800 py-8'>
			<div className='container mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 px-6'>
				{/* Logo & Message */}
				<div className='text-center md:text-left'>
					<h2 className='text-2xl font-bold mb-2'>NextConnect Volunteers</h2>
					<p className='text-sm opacity-75 max-w-xs'>
						Take your volunteering event to the Next level.
					</p>
				</div>

				{/* Navigation Links */}
				<div className='flex space-x-6'>
					<Link legacyBehavior href='/about'>
						<a className='text-sm hover:underline'>About Us</a>
					</Link>
					<Link legacyBehavior href='/events'>
						<a className='text-sm hover:underline'>Events</a>
					</Link>
					<Link legacyBehavior href='/contact'>
						<a className='text-sm hover:underline'>Contact</a>
					</Link>
				</div>

				{/* Social Media Icons */}
				<div className='flex space-x-4'>
					<a
						href='https://facebook.com'
						target='_blank'
						rel='noopener noreferrer'
						className='text-gray-800 hover:text-gray-600'
					>
						<BsFacebook className='text-2xl' />
					</a>
					<a
						href='https://www.instagram.com/nextc_onnect/'
						target='_blank'
						rel='noopener noreferrer'
						className='text-gray-800 hover:text-gray-600'
					>
						<BsInstagram className='text-2xl' />
					</a>
					<a
						href='https://twitter.com'
						target='_blank'
						rel='noopener noreferrer'
						className='text-gray-800 hover:text-gray-600'
					>
						<BsTwitter className='text-2xl' />
					</a>
				</div>
			</div>

			{/* Bottom Copyright */}
			<div className='text-center mt-4 opacity-75 text-sm'>
				&copy; {new Date().getFullYear()} NextConnect. All Rights Reserved.
			</div>
		</footer>
	);
};

export default Footer;
