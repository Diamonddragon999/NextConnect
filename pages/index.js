import Head from "next/head";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { FaHandsHelping, FaLeaf, FaChalkboardTeacher, FaGlobe, FaHeartbeat } from "react-icons/fa";

export default function Home() {
	return (
		<>
			<Head>
				<title>NextConnect - Volunteering for a Better World</title>
				<meta
					name='description'
					content='Join our mission to make a difference through volunteering and community support.'
				/>
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/images/favicon.ico' />
			</Head>
			<main className='home bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen'>
				<Nav />
				<section className='h-dvh flex flex-col justify-center items-center text-center bg-gradient-to-r from-blue-600 to-purple-700 text-white p-6 animated-gradient'>
	<h1 className='text-5xl md:text-6xl font-bold mb-4'>
		Connect, Volunteer, Impact
	</h1>
	<p className='text-xl md:text-2xl max-w-2xl mx-auto mb-8'>
		NextConnect brings passionate people together to make a lasting difference.
		Join us in empowering communities, protecting our planet, and building a brighter future.
	</p>
	<a
		href='/dashboard'
		className='mt-4 px-10 py-4 bg-white text-black font-semibold rounded-full shadow-lg hover:bg-blue-300 transition-all duration-300'
	>
		Create your event
	</a>
</section>


				{/* Why We’re Different */}
				<section className='py-20 bg-white'>
					<div className='container mx-auto px-6 md:px-12 text-center'>
						<h2 className='text-3xl md:text-4xl font-extrabold text-blue-600 mb-6'>
							What Makes Us Unique
						</h2>
						<p className='text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-12'>
							NextConnect redefines volunteering by connecting individuals with meaningful causes
							that match their talents. With us, volunteering is more than just giving back; it’s
							about building a supportive community and creating real change.
						</p>
						<div className='flex flex-col md:flex-row justify-center gap-8'>
							<div className='p-8 rounded-lg shadow-lg bg-blue-50 transition-all duration-300 hover:shadow-xl'>
								<FaHandsHelping className='text-4xl text-blue-600 mx-auto mb-4' />
								<h3 className='text-2xl font-semibold text-blue-600 mb-4'>Collaborative Projects</h3>
								<p className='text-gray-600'>
									We bring people together to achieve more through collaboration, turning individual actions into powerful change.
								</p>
							</div>
							<div className='p-8 rounded-lg shadow-lg bg-blue-50 transition-all duration-300 hover:shadow-xl'>
								<FaHeartbeat className='text-4xl text-blue-600 mx-auto mb-4' />
								<h3 className='text-2xl font-semibold text-blue-600 mb-4'>Sustainable Impact</h3>
								<p className='text-gray-600'>
									Our focus is on projects that make a lasting difference, prioritizing sustainability and community welfare.
								</p>
							</div>
							<div className='p-8 rounded-lg shadow-lg bg-blue-50 transition-all duration-300 hover:shadow-xl'>
								<FaGlobe className='text-4xl text-blue-600 mx-auto mb-4' />
								<h3 className='text-2xl font-semibold text-blue-600 mb-4'>Global Reach</h3>
								<p className='text-gray-600'>
									Our platform connects volunteers from around the world, expanding the impact of each project beyond borders.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Areas of Focus */}
				<section className='py-20 bg-blue-50'>
					<div className='container mx-auto px-6 md:px-12'>
						<h2 className='text-3xl md:text-4xl font-extrabold text-blue-600 text-center mb-10'>
							Our Areas of Focus
						</h2>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
							<div className='p-8 rounded-lg shadow-lg bg-white hover:shadow-xl transition-all duration-300'>
								<FaHandsHelping className='text-4xl text-blue-600 mb-4 mx-auto' />
								<h3 className='text-2xl font-semibold text-blue-600 mb-4'>
									Community Outreach
								</h3>
								<p className='text-gray-600'>
									Work directly with communities to uplift and empower through education, health services, and social support.
								</p>
							</div>
							<div className='p-8 rounded-lg shadow-lg bg-white hover:shadow-xl transition-all duration-300'>
								<FaLeaf className='text-4xl text-blue-600 mb-4 mx-auto' />
								<h3 className='text-2xl font-semibold text-blue-600 mb-4'>
									Environmental Care
								</h3>
								<p className='text-gray-600'>
									Engage in conservation activities such as clean-up drives and reforestation efforts to protect our planet.
								</p>
							</div>
							<div className='p-8 rounded-lg shadow-lg bg-white hover:shadow-xl transition-all duration-300'>
								<FaChalkboardTeacher className='text-4xl text-blue-600 mb-4 mx-auto' />
								<h3 className='text-2xl font-semibold text-blue-600 mb-4'>
									Educational Support
								</h3>
								<p className='text-gray-600'>
									Support students through tutoring, mentorship, and educational programs that promote learning and growth.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Impact Section */}
				<section className='py-20 bg-gradient-to-r from-blue-500 to-purple-600 text-white'>
					<div className='container mx-auto px-6 md:px-12 text-center'>
						<h2 className='text-3xl md:text-4xl font-extrabold mb-4'>Our Impact</h2>
						<p className='text-lg md:text-xl max-w-2xl mx-auto mb-10'>
						With the dedication of countless volunteers contributing thousands of hours, NextConnect will bring hope, support, and growth to communities across the globe.
						</p>
						<a
							href='/about'
							className='px-10 py-4 bg-white text-black font-semibold rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300'
						>
							Who we are
						</a>
					</div>
				</section>

				<Footer />
			</main>
		</>
	);
}
