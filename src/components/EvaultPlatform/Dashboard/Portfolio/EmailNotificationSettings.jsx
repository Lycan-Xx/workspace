import { useState } from "react"
import { Mail, Settings, Bell, Check, AlertCircle } from "lucide-react"

const EmailNotificationSettings = ({ businessType }) => {
  const [settings, setSettings] = useState({
    paymentConfirmations: true,
    paymentReminders: true,
    weeklyReports: false,
    monthlyReports: true,
    customFromEmail: "",
    customFromName: "",
    bccEmails: "",
  })

  const [testEmail, setTestEmail] = useState("")
  const [isSendingTest, setIsSendingTest] = useState(false)

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSaveSettings = () => {
    alert("Your email notification settings have been updated successfully.")
  }

  const handleSendTestEmail = async () => {
    if (!testEmail) {
      alert("Please enter an email address to send the test.")
      return
    }

    setIsSendingTest(true)

    setTimeout(() => {
      setIsSendingTest(false)
      alert(`A sample ${businessType} payment confirmation has been sent to ${testEmail}`)
    }, 2000)
  }

  const notificationTypes = [
    {
      key: "paymentConfirmations",
      title: "Payment Confirmations",
      description:
        businessType === "school"
          ? "Send confirmation emails to parents when payments are received"
          : "Send confirmation emails to clients when payments are processed",
      icon: Check,
      color: "text-green-600",
    },
    {
      key: "paymentReminders",
      title: "Payment Reminders",
      description:
        businessType === "school"
          ? "Send reminder emails for upcoming or overdue school fees"
          : "Send reminder emails for pending invoices",
      icon: Bell,
      color: "text-blue-600",
    },
    {
      key: "weeklyReports",
      title: "Weekly Reports",
      description: "Receive weekly summaries of payment activity",
      icon: Mail,
      color: "text-purple-600",
    },
    {
      key: "monthlyReports",
      title: "Monthly Reports",
      description: "Receive detailed monthly payment and financial reports",
      icon: AlertCircle,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="h-5 w-5 text-blue-600" />
        <h2 className="text-xl font-bold">Email Notification Settings</h2>
      </div>
      <p className="text-gray-600 mb-6">Configure how and when email notifications are sent for your {businessType}</p>

      <div className="space-y-6">
        {/* Notification Types */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Notification Types</h3>
          {notificationTypes.map((notification) => {
            const Icon = notification.icon
            return (
              <div key={notification.key} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${notification.color}`} />
                  <div>
                    <h4 className="font-medium">{notification.title}</h4>
                    <p className="text-sm text-gray-500">{notification.description}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings[notification.key]}
                    onChange={(e) => handleSettingChange(notification.key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            )
          })}
        </div>

        {/* Test Email */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Test Email</h3>
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="email"
                placeholder="Enter email to send test notification"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleSendTestEmail}
              disabled={isSendingTest}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                isSendingTest
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isSendingTest ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </div>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2 inline" />
                  Send Test
                </>
              )}
            </button>
          </div>
          <p className="text-sm text-gray-500">Send a sample payment confirmation email to test your settings</p>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t">
          <button
            onClick={handleSaveSettings}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Settings className="h-4 w-4" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmailNotificationSettings