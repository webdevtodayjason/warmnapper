"use client";

import { useState } from "react";
import { useWiFi } from "@/contexts/wifi-context";
import { formatDate, formatMac, getAuthModeDescription, truncateSsid } from "@/lib/utils";
import { getSecurityLevel, getSignalStrength } from "@/lib/wifi-utils";
import { AccessPoint } from "@/types";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Wifi,
  WifiOff,
  ShieldAlert,
  ShieldCheck,
  SignalHigh,
  SignalMedium,
  SignalLow,
  Search,
  ArrowUpDown,
  ChevronDown,
  ChevronUp
} from "lucide-react";

// Define table columns
type Column = {
  key: keyof AccessPoint | 'securityIcon' | 'signalIcon';
  label: string;
  sortable: boolean;
  render?: (ap: AccessPoint) => React.ReactNode;
};

export function DataTable() {
  const { accessPoints } = useWiFi();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<keyof AccessPoint | 'securityIcon' | 'signalIcon'>("RSSI");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Define columns for the table
  const columns: Column[] = [
    {
      key: 'SSID',
      label: 'Network Name',
      sortable: true,
      render: (ap) => (
        <div className="flex items-center">
          {ap.SSID ? <Wifi className="mr-2 h-4 w-4" /> : <WifiOff className="mr-2 h-4 w-4 text-muted-foreground" />}
          <span>{ap.SSID || <span className="text-muted-foreground italic">unnamed</span>}</span>
        </div>
      ),
    },
    {
      key: 'MAC',
      label: 'MAC Address',
      sortable: true,
      render: (ap) => formatMac(ap.MAC),
    },
    {
      key: 'securityIcon',
      label: 'Security',
      sortable: true,
      render: (ap) => {
        const security = getSecurityLevel(ap.AuthMode);
        let icon;
        switch (security) {
          case 'None':
            icon = <ShieldAlert className="h-4 w-4 text-red-500" />;
            break;
          case 'Low':
            icon = <ShieldAlert className="h-4 w-4 text-orange-500" />;
            break;
          case 'Medium':
            icon = <ShieldCheck className="h-4 w-4 text-yellow-500" />;
            break;
          case 'High':
            icon = <ShieldCheck className="h-4 w-4 text-green-500" />;
            break;
          default:
            icon = <ShieldCheck className="h-4 w-4 text-gray-500" />;
        }
        return (
          <div className="flex items-center">
            {icon}
            <span className="ml-2">{getAuthModeDescription(ap.AuthMode)}</span>
          </div>
        );
      },
    },
    {
      key: 'Channel',
      label: 'Channel',
      sortable: true,
    },
    {
      key: 'signalIcon',
      label: 'Signal',
      sortable: true,
      render: (ap) => {
        const signal = getSignalStrength(ap.RSSI);
        let icon;
        switch (signal) {
          case 'Excellent':
            icon = <SignalHigh className="h-4 w-4 text-green-500" />;
            break;
          case 'Good':
            icon = <SignalHigh className="h-4 w-4 text-yellow-500" />;
            break;
          case 'Fair':
            icon = <SignalMedium className="h-4 w-4 text-orange-500" />;
            break;
          case 'Poor':
            icon = <SignalLow className="h-4 w-4 text-red-500" />;
            break;
          default:
            icon = <SignalLow className="h-4 w-4 text-gray-500" />;
        }
        return (
          <div className="flex items-center">
            {icon}
            <span className="ml-2">{ap.RSSI} dBm</span>
          </div>
        );
      },
    },
    {
      key: 'FirstSeen',
      label: 'First Seen',
      sortable: true,
      render: (ap) => formatDate(ap.FirstSeen),
    },
    {
      key: 'CurrentLatitude',
      label: 'Location',
      sortable: false,
      render: (ap) => (
        <div>
          {ap.CurrentLatitude.toFixed(6)}, {ap.CurrentLongitude.toFixed(6)}
        </div>
      ),
    },
  ];

  // Filter access points based on search term
  const filteredAccessPoints = accessPoints.filter((ap) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      ap.SSID?.toLowerCase().includes(searchLower) ||
      ap.MAC.toLowerCase().includes(searchLower) ||
      ap.AuthMode.toLowerCase().includes(searchLower)
    );
  });

  // Custom sort function for security and signal
  const sortAccessPoints = (a: AccessPoint, b: AccessPoint) => {
    if (sortBy === 'securityIcon') {
      // Sort by security level
      const securityA = getSecurityLevel(a.AuthMode);
      const securityB = getSecurityLevel(b.AuthMode);
      const securityLevels = ['None', 'Low', 'Medium', 'High'];
      const sortValue = securityLevels.indexOf(securityB) - securityLevels.indexOf(securityA);
      return sortDirection === 'asc' ? -sortValue : sortValue;
    } else if (sortBy === 'signalIcon') {
      // Sort by signal strength (RSSI)
      return sortDirection === 'asc' ? a.RSSI - b.RSSI : b.RSSI - a.RSSI;
    } else {
      // Sort by any other column
      const aValue = a[sortBy] as string | number;
      const bValue = b[sortBy] as string | number;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      } else {
        return sortDirection === 'asc' 
          ? Number(aValue) - Number(bValue) 
          : Number(bValue) - Number(aValue);
      }
    }
  };

  // Sort filtered access points
  const sortedAccessPoints = [...filteredAccessPoints].sort(sortAccessPoints);

  // Handle column header click
  const handleHeaderClick = (column: Column) => {
    if (!column.sortable) return;
    
    if (sortBy === column.key) {
      // Toggle sort direction if already sorting by this column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort column and default to ascending
      setSortBy(column.key);
      setSortDirection('asc');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search networks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="text-sm text-muted-foreground">
          Showing {sortedAccessPoints.length} of {accessPoints.length} networks
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className="whitespace-nowrap">
                  <Button
                    variant="ghost"
                    onClick={() => handleHeaderClick(column)}
                    disabled={!column.sortable}
                    className={!column.sortable ? 'cursor-default' : ''}
                  >
                    {column.label}
                    {column.sortable && (
                      <span className="ml-2">
                        {sortBy === column.key ? (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        ) : (
                          <ArrowUpDown className="h-4 w-4 opacity-50" />
                        )}
                      </span>
                    )}
                  </Button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAccessPoints.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No networks found.
                </TableCell>
              </TableRow>
            ) : (
              sortedAccessPoints.map((ap) => (
                <TableRow key={ap.MAC}>
                  {columns.map((column) => (
                    <TableCell key={`${ap.MAC}-${column.key}`}>
                      {column.render ? column.render(ap) : ap[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}