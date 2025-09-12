import { Home, PanelLeft, Folder, Users, User2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useNavigation } from 'react-router';

import logo from '@/assets/logo.svg';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { paths } from '@/config/paths';
import { ROLES, useAuthorization } from '@/lib/authorization';
import { cn } from '@/utils/cn';