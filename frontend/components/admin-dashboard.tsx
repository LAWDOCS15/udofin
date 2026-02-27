// 'use client'

// import { useState } from 'react'
// import { Button } from '@/components/ui/button'
// import {
//   BarChart3, Users, FileText, TrendingUp, DollarSign, AlertCircle,
//   Search, Filter, Download, ChevronRight, Eye, CheckCircle2, Clock,
//   ArrowUpRight, ArrowDownLeft, MoreVertical, Settings, Bell, LogOut
// } from 'lucide-react'

// interface LoanApplication {
//   id: string
//   applicantName: string
//   amount: number
//   status: 'pending' | 'approved' | 'rejected' | 'disbursed'
//   rate: number
//   appliedDate: string
//   cibil: number
// }

// export function AdminDashboard() {
//   const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'reports'>('overview')
//   const [searchQuery, setSearchQuery] = useState('')

//   const loanApplications: LoanApplication[] = [
//     { id: 'APP001', applicantName: 'Virendra Singh', amount: 800000, status: 'approved', rate: 10.50, appliedDate: 'Today', cibil: 758 },
//     { id: 'APP002', applicantName: 'Priya Sharma', amount: 500000, status: 'pending', rate: 11.25, appliedDate: 'Yesterday', cibil: 745 },
//     { id: 'APP003', applicantName: 'Rajesh Kumar', amount: 1000000, status: 'disbursed', rate: 9.75, appliedDate: '2 days ago', cibil: 780 },
//     { id: 'APP004', applicantName: 'Anjali Patel', amount: 600000, status: 'pending', rate: 11.50, appliedDate: '3 days ago', cibil: 720 },
//     { id: 'APP005', applicantName: 'Arjun Verma', amount: 450000, status: 'rejected', rate: 12.00, appliedDate: '4 days ago', cibil: 680 },
//   ]

//   const stats = [
//     { label: 'Total Applications', value: '1,284', change: '+12.5%', icon: FileText, color: 'bg-blue-50', textColor: 'text-blue-600' },
//     { label: 'Active Users', value: '8,932', change: '+5.2%', icon: Users, color: 'bg-green-50', textColor: 'text-green-600' },
//     { label: 'Total Disbursed', value: '₹42.5Cr', change: '+18.3%', icon: DollarSign, color: 'bg-purple-50', textColor: 'text-purple-600' },
//     { label: 'Approval Rate', value: '87.3%', change: '+3.1%', icon: TrendingUp, color: 'bg-orange-50', textColor: 'text-orange-600' },
//   ]

//   const getStatusBadge = (status: string) => {
//     const colors = {
//       pending: 'bg-yellow-100 text-yellow-800',
//       approved: 'bg-green-100 text-green-800',
//       disbursed: 'bg-blue-100 text-blue-800',
//       rejected: 'bg-red-100 text-red-800',
//     }
//     return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
//   }

//   return (
//     <div className="min-h-screen bg-slate-50">
//       {/* Header */}
//       <div className="border-b border-slate-200 bg-white sticky top-0 z-40">
//         <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
//           <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
//           <div className="flex items-center gap-4">
//             <Button variant="ghost" size="icon">
//               <Bell className="h-5 w-5 text-slate-600" />
//             </Button>
//             <Button variant="ghost" size="icon">
//               <Settings className="h-5 w-5 text-slate-600" />
//             </Button>
//             <Button variant="ghost" size="icon">
//               <LogOut className="h-5 w-5 text-slate-600" />
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="mx-auto max-w-7xl px-6 py-8">
//         {/* Stats Grid */}
//         <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
//           {stats.map((stat) => {
//             const Icon = stat.icon
//             return (
//               <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-6 hover:shadow-md transition-shadow">
//                 <div className={`inline-block rounded-lg ${stat.color} p-3 mb-3`}>
//                   <Icon className={`h-5 w-5 ${stat.textColor}`} />
//                 </div>
//                 <p className="text-sm text-slate-600">{stat.label}</p>
//                 <div className="mt-2 flex items-end justify-between">
//                   <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
//                   <p className="text-xs font-medium text-green-600">{stat.change}</p>
//                 </div>
//               </div>
//             )
//           })}
//         </div>

//         {/* Tabs */}
//         <div className="mb-6 flex gap-2 border-b border-slate-200">
//           {['overview', 'applications', 'reports'].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab as any)}
//               className={`px-4 py-3 font-medium text-sm capitalize border-b-2 transition-colors ${
//                 activeTab === tab
//                   ? 'border-blue-600 text-blue-600'
//                   : 'border-transparent text-slate-600 hover:text-slate-900'
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* Applications Table */}
//         {activeTab === 'applications' && (
//           <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
//             {/* Search & Filter */}
//             <div className="border-b border-slate-200 p-6 flex gap-4">
//               <div className="flex-1 relative">
//                 <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
//                 <input
//                   type="text"
//                   placeholder="Search by name or ID..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <Button variant="outline" className="gap-2">
//                 <Filter className="h-4 w-4" />
//                 Filter
//               </Button>
//               <Button variant="outline" className="gap-2">
//                 <Download className="h-4 w-4" />
//                 Export
//               </Button>
//             </div>

//             {/* Table */}
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="border-b border-slate-200 bg-slate-50">
//                     <th className="px-6 py-4 text-left font-semibold text-slate-900">Applicant</th>
//                     <th className="px-6 py-4 text-left font-semibold text-slate-900">Loan Amount</th>
//                     <th className="px-6 py-4 text-left font-semibold text-slate-900">CIBIL</th>
//                     <th className="px-6 py-4 text-left font-semibold text-slate-900">Rate</th>
//                     <th className="px-6 py-4 text-left font-semibold text-slate-900">Status</th>
//                     <th className="px-6 py-4 text-left font-semibold text-slate-900">Date</th>
//                     <th className="px-6 py-4 text-left font-semibold text-slate-900">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {loanApplications.map((app) => (
//                     <tr key={app.id} className="border-b border-slate-100 hover:bg-slate-50">
//                       <td className="px-6 py-4">
//                         <div>
//                           <p className="font-medium text-slate-900">{app.applicantName}</p>
//                           <p className="text-xs text-slate-500">{app.id}</p>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 font-medium text-slate-900">₹{(app.amount / 100000).toFixed(1)}L</td>
//                       <td className="px-6 py-4">
//                         <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                           {app.cibil}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 font-medium text-slate-900">{app.rate}%</td>
//                       <td className="px-6 py-4">
//                         <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(app.status)}`}>
//                           {app.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-slate-600">{app.appliedDate}</td>
//                       <td className="px-6 py-4">
//                         <Button variant="ghost" size="icon" className="h-8 w-8">
//                           <Eye className="h-4 w-4 text-slate-600" />
//                         </Button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-between">
//               <p className="text-sm text-slate-600">Showing 1-5 of 124 applications</p>
//               <div className="flex gap-2">
//                 <Button variant="outline" size="sm">Previous</Button>
//                 <Button size="sm" className="bg-blue-600">1</Button>
//                 <Button variant="outline" size="sm">2</Button>
//                 <Button variant="outline" size="sm">3</Button>
//                 <Button variant="outline" size="sm">Next</Button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Overview Tab */}
//         {activeTab === 'overview' && (
//           <div className="grid gap-8 lg:grid-cols-3">
//             {/* Recent Applications */}
//             <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6">
//               <h2 className="mb-6 text-lg font-bold text-slate-900">Recent Applications</h2>
//               <div className="space-y-4">
//                 {loanApplications.slice(0, 3).map((app) => (
//                   <div key={app.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
//                     <div className="flex-1">
//                       <p className="font-semibold text-slate-900">{app.applicantName}</p>
//                       <p className="text-xs text-slate-500">₹{(app.amount / 100000).toFixed(1)}L • CIBIL: {app.cibil}</p>
//                     </div>
//                     <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(app.status)}`}>
//                       {app.status}
//                     </span>
//                     <ChevronRight className="h-4 w-4 text-slate-400 ml-2" />
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Quick Actions */}
//             <div className="rounded-2xl border border-slate-200 bg-white p-6">
//               <h2 className="mb-6 text-lg font-bold text-slate-900">Quick Actions</h2>
//               <div className="space-y-3">
//                 <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white">
//                   <CheckCircle2 className="h-4 w-4 mr-2" />
//                   Approve Loans
//                 </Button>
//                 <Button variant="outline" className="w-full justify-start">
//                   <Clock className="h-4 w-4 mr-2" />
//                   Pending Review
//                 </Button>
//                 <Button variant="outline" className="w-full justify-start">
//                   <Download className="h-4 w-4 mr-2" />
//                   Generate Report
//                 </Button>
//                 <Button variant="outline" className="w-full justify-start">
//                   <Settings className="h-4 w-4 mr-2" />
//                   Settings
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }



'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from "@/components/SimpleToast"
import {
  BarChart3, Users, FileText, TrendingUp, DollarSign, AlertCircle,
  Search, Filter, Download, ChevronRight, Eye, CheckCircle2, Clock,
  ArrowUpRight, ArrowDownLeft, MoreVertical, Settings, Bell, LogOut,
  Plus, Loader2, Building2, UserPlus, X
} from 'lucide-react'

interface LoanApplication {
  id: string
  applicantName: string
  amount: number
  status: 'pending' | 'approved' | 'rejected' | 'disbursed'
  rate: number
  appliedDate: string
  cibil: number
}

export function AdminDashboard() {
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'reports'>('overview')
  const [searchQuery, setSearchQuery] = useState('')

  // State for creating NBFC & Admin Modal
  const [showAddPartnerModal, setShowAddPartnerModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [partnerForm, setPartnerForm] = useState({
    nbfcName: '',
    registrationNumber: '',
    adminName: '',
    adminEmail: '',
    adminPassword: ''
  })

  const loanApplications: LoanApplication[] = [
    { id: 'APP001', applicantName: 'Virendra Singh', amount: 800000, status: 'approved', rate: 10.50, appliedDate: 'Today', cibil: 758 },
    { id: 'APP002', applicantName: 'Priya Sharma', amount: 500000, status: 'pending', rate: 11.25, appliedDate: 'Yesterday', cibil: 745 },
    { id: 'APP003', applicantName: 'Rajesh Kumar', amount: 1000000, status: 'disbursed', rate: 9.75, appliedDate: '2 days ago', cibil: 780 },
    { id: 'APP004', applicantName: 'Anjali Patel', amount: 600000, status: 'pending', rate: 11.50, appliedDate: '3 days ago', cibil: 720 },
    { id: 'APP005', applicantName: 'Arjun Verma', amount: 450000, status: 'rejected', rate: 12.00, appliedDate: '4 days ago', cibil: 680 },
  ]

  const stats = [
    { label: 'Total Applications', value: '1,284', change: '+12.5%', icon: FileText, color: 'bg-blue-50', textColor: 'text-blue-600' },
    { label: 'Active Users', value: '8,932', change: '+5.2%', icon: Users, color: 'bg-green-50', textColor: 'text-green-600' },
    { label: 'Total Disbursed', value: '₹42.5Cr', change: '+18.3%', icon: DollarSign, color: 'bg-purple-50', textColor: 'text-purple-600' },
    { label: 'Approval Rate', value: '87.3%', change: '+3.1%', icon: TrendingUp, color: 'bg-orange-50', textColor: 'text-orange-600' },
  ]

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      disbursed: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800',
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  // API Call to create NBFC and Admin
  const handleCreatePartner = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Step 1: Create the NBFC Company
      const nbfcRes = await fetch('http://localhost:5000/api/admin/create-nbfc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: partnerForm.nbfcName,
          registrationNumber: partnerForm.registrationNumber
        })
      })
      const nbfcData = await nbfcRes.json()

      if (!nbfcRes.ok) throw new Error(nbfcData.message || 'Failed to create NBFC')

      const newNbfcId = nbfcData.nbfc._id

      // Step 2: Create the Admin User linked to this NBFC
      const adminRes = await fetch('http://localhost:5000/api/admin/create-nbfc-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: partnerForm.adminName,
          email: partnerForm.adminEmail,
          password: partnerForm.adminPassword,
          nbfcId: newNbfcId
        })
      })
      const adminData = await adminRes.json()

      if (!adminRes.ok) throw new Error(adminData.message || 'Failed to create NBFC Admin')

      showToast('Partner NBFC and Admin created successfully!', 'success')
      setShowAddPartnerModal(false)
      
      // Clear form
      setPartnerForm({
        nbfcName: '', registrationNumber: '', adminName: '', adminEmail: '', adminPassword: ''
      })

    } catch (err: any) {
      showToast(err.message, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
          <div className="flex items-center gap-4">
            
            {/* NEW: Add Partner Button */}
            <Button 
              onClick={() => setShowAddPartnerModal(true)}
              className="hidden md:flex gap-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg shadow-sm"
            >
              <Plus className="h-4 w-4" /> Add Partner
            </Button>

            <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block"></div>

            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5 text-slate-600" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5 text-slate-600" />
            </Button>
            <Button variant="ghost" size="icon">
              <LogOut className="h-5 w-5 text-slate-600" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-6 hover:shadow-md transition-shadow">
                <div className={`inline-block rounded-lg ${stat.color} p-3 mb-3`}>
                  <Icon className={`h-5 w-5 ${stat.textColor}`} />
                </div>
                <p className="text-sm text-slate-600">{stat.label}</p>
                <div className="mt-2 flex items-end justify-between">
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-xs font-medium text-green-600">{stat.change}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-slate-200">
          {['overview', 'applications', 'reports'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-3 font-medium text-sm capitalize border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Applications Table */}
        {activeTab === 'applications' && (
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            {/* Search & Filter */}
            <div className="border-b border-slate-200 p-6 flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-left font-semibold text-slate-900">Applicant</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-900">Loan Amount</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-900">CIBIL</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-900">Rate</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-900">Status</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-900">Date</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-900">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loanApplications.map((app) => (
                    <tr key={app.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900">{app.applicantName}</p>
                          <p className="text-xs text-slate-500">{app.id}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">₹{(app.amount / 100000).toFixed(1)}L</td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {app.cibil}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">{app.rate}%</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{app.appliedDate}</td>
                      <td className="px-6 py-4">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4 text-slate-600" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-between">
              <p className="text-sm text-slate-600">Showing 1-5 of 124 applications</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Previous</Button>
                <Button size="sm" className="bg-blue-600">1</Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Recent Applications */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="mb-6 text-lg font-bold text-slate-900">Recent Applications</h2>
              <div className="space-y-4">
                {loanApplications.slice(0, 3).map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{app.applicantName}</p>
                      <p className="text-xs text-slate-500">₹{(app.amount / 100000).toFixed(1)}L • CIBIL: {app.cibil}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(app.status)}`}>
                      {app.status}
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-400 ml-2" />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="mb-6 text-lg font-bold text-slate-900">Quick Actions</h2>
              <div className="space-y-3">
                <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Approve Loans
                </Button>
                
                {/* NEW: Onboard Partner Button in Quick Actions */}
                <Button 
                  onClick={() => setShowAddPartnerModal(true)}
                  variant="outline" 
                  className="w-full justify-start border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Onboard NBFC Partner
                </Button>

                <Button variant="outline" className="w-full justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  Pending Review
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Add NBFC Partner & Admin */}
      {showAddPartnerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
            onClick={() => !isSubmitting && setShowAddPartnerModal(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Onboard Lending Partner</h3>
                <p className="text-xs text-slate-500 mt-0.5">Create NBFC and assign an Admin</p>
              </div>
              <button 
                type="button"
                onClick={() => setShowAddPartnerModal(false)}
                disabled={isSubmitting}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePartner} className="p-6">
              <div className="space-y-4">
                
                {/* Step 1: NBFC Details */}
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                    <Building2 className="h-4 w-4 text-blue-600" /> Company Details
                  </h4>
                  <div className="grid gap-3">
                    <input 
                      type="text" 
                      placeholder="NBFC Company Name (e.g., Bajaj Finserv)" 
                      required
                      value={partnerForm.nbfcName}
                      onChange={(e) => setPartnerForm({...partnerForm, nbfcName: e.target.value})}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                    <input 
                      type="text" 
                      placeholder="Registration Number (CIN/RBI Reg No)" 
                      required
                      value={partnerForm.registrationNumber}
                      onChange={(e) => setPartnerForm({...partnerForm, registrationNumber: e.target.value})}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="h-px w-full bg-slate-100 my-4" />

                {/* Step 2: Admin Details */}
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                    <UserPlus className="h-4 w-4 text-green-600" /> Admin Account
                  </h4>
                  <div className="grid gap-3">
                    <input 
                      type="text" 
                      placeholder="Admin Full Name" 
                      required
                      value={partnerForm.adminName}
                      onChange={(e) => setPartnerForm({...partnerForm, adminName: e.target.value})}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                    <input 
                      type="email" 
                      placeholder="Admin Email Address" 
                      required
                      value={partnerForm.adminEmail}
                      onChange={(e) => setPartnerForm({...partnerForm, adminEmail: e.target.value})}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                    <input 
                      type="password" 
                      placeholder="Set Admin Password" 
                      required
                      minLength={6}
                      value={partnerForm.adminPassword}
                      onChange={(e) => setPartnerForm({...partnerForm, adminPassword: e.target.value})}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-end gap-3">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setShowAddPartnerModal(false)}
                  disabled={isSubmitting}
                  className="text-slate-600"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white hover:bg-blue-700 min-w-[120px]"
                >
                  {isSubmitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating...</> : 'Create Partner'}
                </Button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  )
}