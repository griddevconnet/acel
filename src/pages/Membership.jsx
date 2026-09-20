import { Navigate } from 'react-router-dom'
import MembershipSection from '../components/Membership.jsx'

export default function Membership() {
  return <Navigate to="/membership/apply" replace />
}
